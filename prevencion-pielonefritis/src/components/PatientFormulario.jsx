import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META, calcularRecurrenciaDesdeEpisodios } from '../services/clinicalEngine';

const INITIAL_FORM = {
  // 1. Datos y contexto
  sexo: '',
  nacionalidad: '',
  embarazo: false,
  semanasGestacion: '',
  // 2. Salud y antecedentes
  diabetes: false,
  obesidad: false,
  hipertension: false,
  enfermedadRenal: false,
  enfermedadRenalDetalle: '',
  dialisis: false,
  problemasProstaticos: false,
  litiasisAntecedente: false,
  obstruccionSospechada: false,
  inmunosupresion: false,
  sondaUrinaria: false,
  instrumentacionReciente: false,
  hospitalizacionReciente: false,
  hospitalizacionDetalle: '',
  restriccionHidrica: false,
  // 3. Episodios urinarios y síntomas actuales
  enTratamientoItu: false,
  ituConfirmadas6m: '',
  ituConfirmadas12m: '',
  episodiosUrinarios: [],
  temperatura: '',
  dolorIntensidad: '',
  dolorFlancoLumbar: false,
  escalofriosTemblor: false,
  vomitosPersistentes: false,
  disminucionOrina: false,
  sintomasUrinariosBajos: false,
  sangreOrina: false,
  coagulosRetencion: false,
  confusionAguda: false,
  desmayoODisnea: false,
  // 4. Cultivos, antibióticos y hábitos
  alergias: '',
  medicamentosActuales: '',
  antibioticoDetalle: '',
  efectosAdversos: '',
  miccionPostcoital: '',
  usoEspermicidas: '',
  consumoArandano: '',
  observaciones: '',
  // 5. Consentimiento explícito
  consentimientoNoDiagnostico: false,
  autorizaCompartirEquipo: false,
};

export default function PatientFormulario() {
  const [usuario, setUsuario] = useState(getStoredUser());
  const [form, setForm] = useState(INITIAL_FORM);
  const [nuevoEpisodio, setNuevoEpisodio] = useState({ fecha: '', tipo: '', nota: '' });
  const [epError, setEpError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultadoGuardado, setResultadoGuardado] = useState(null);
  const [derivacionActiva, setDerivacionActiva] = useState(false);
  const [historialEval, setHistorialEval] = useState([]);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const pacienteId = getStoredUser()?.id || 3;
        const [u, evs] = await Promise.all([
          api.getUsuario(pacienteId),
          api.getEvaluacionesPaciente(pacienteId),
        ]);
        setUsuario(u);
        setHistorialEval(evs || []);
      } catch (err) {
        console.error(err);
      }
    };
    cargarPerfil();
  }, []);

  const handleChange = (field, value) => {
    if (error) setError('');
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAgregarEpisodio = () => {
    setEpError('');
    if (!nuevoEpisodio.fecha || !nuevoEpisodio.tipo) {
      setEpError('Indica la fecha y selecciona si el episodio fue confirmado o no.');
      return;
    }
    const listaActualizada = [
      ...form.episodiosUrinarios,
      {
        id: Date.now(),
        fecha: nuevoEpisodio.fecha,
        tipo: nuevoEpisodio.tipo,
        nota: nuevoEpisodio.nota.trim(),
      },
    ];
    const calc = calcularRecurrenciaDesdeEpisodios(listaActualizada);

    setForm((prev) => ({
      ...prev,
      episodiosUrinarios: listaActualizada,
      ituConfirmadas6m: String(Math.max(Number(prev.ituConfirmadas6m || 0), calc.confirmados6m)),
      ituConfirmadas12m: String(Math.max(Number(prev.ituConfirmadas12m || 0), calc.confirmados12m)),
    }));
    setNuevoEpisodio({ fecha: '', tipo: '', nota: '' });
  };

  const handleEliminarEpisodio = (id) => {
    const listaActualizada = form.episodiosUrinarios.filter((ep) => ep.id !== id);
    const calc = calcularRecurrenciaDesdeEpisodios(listaActualizada);
    setForm((prev) => ({
      ...prev,
      episodiosUrinarios: listaActualizada,
      ituConfirmadas6m: String(calc.confirmados6m),
      ituConfirmadas12m: String(calc.confirmados12m),
    }));
  };

  const calcRec = calcularRecurrenciaDesdeEpisodios(form.episodiosUrinarios);
  const total6m = Math.max(Number(form.ituConfirmadas6m || 0), calcRec.confirmados6m);
  const total12m = Math.max(Number(form.ituConfirmadas12m || 0), calcRec.confirmados12m);
  const cumpleRecurrencia = total6m >= 2 || total12m >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.consentimientoNoDiagnostico) {
      setError('Debes confirmar el consentimiento en el paso 5 para guardar tu evaluación.');
      return;
    }

    setLoading(true);
    try {
      const pacienteId = usuario?.id || getStoredUser()?.id || 3;
      const { evaluacion, resultado, derivacionActivada } = await api.crearEvaluacion(pacienteId, {
        ...form,
        ituConfirmadas6m: total6m,
        ituConfirmadas12m: total12m,
      });
      setResultadoGuardado(resultado);
      setDerivacionActiva(Boolean(derivacionActivada));
      setHistorialEval((prev) => [evaluacion, ...prev]);
      const actualizado = await api.getUsuario(pacienteId);
      setUsuario(actualizado);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'No se pudo guardar la evaluación.');
    } finally {
      setLoading(false);
    }
  };

  const metaResultado = resultadoGuardado
    ? PRIORIDAD_META[resultadoGuardado.nivelSemaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE
    : null;

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto pb-16">
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
          Evaluación clínica y antecedentes urinarios
        </h1>
        <p className="text-slate-600 text-sm font-normal font-['Inter']">
          Completa los 5 pasos con tu información real. Ningún campo viene respondido por defecto; si no cuentas con un dato numérico, déjalo en blanco.
        </p>
      </div>

      {/* Resultado tras enviar */}
      {resultadoGuardado && metaResultado && (
        <div className={`p-5 bg-white rounded-2xl border-2 ${metaResultado.border} shadow-sm flex flex-col gap-3`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${metaResultado.badge}`}>
              {metaResultado.label}
            </span>
            <span className="text-slate-500 text-xs font-medium">Evaluación guardada en tu historial</span>
          </div>
          <p className="text-slate-800 text-sm leading-relaxed">{resultadoGuardado.mensajeProtocolo}</p>

          {derivacionActiva && (
            <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs font-semibold">
              Derivación automática activada: se notificó esta alerta prioritaria al equipo profesional en su Centro de Comando y bandeja de mensajes.
            </div>
          )}

          {resultadoGuardado.triggersActivos?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resultadoGuardado.triggersActivos.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-8">
          {/* Paso 1: Datos y contexto */}
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">1. Datos de contexto</h2>
              <p className="text-slate-600 text-xs mt-0.5">
                Esta información permite adaptar las preguntas de antecedentes (embarazo o salud prostática).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Sexo biológico</label>
                <span className="text-slate-500 text-xs">Selecciona una opción para ajustar los antecedentes clínicos.</span>
                <select
                  value={form.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Nacionalidad</label>
                <span className="text-slate-500 text-xs">Escribe tu país de nacionalidad o residencia actual.</span>
                <input
                  type="text"
                  value={form.nacionalidad}
                  onChange={(e) => handleChange('nacionalidad', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>
            </div>

            {form.sexo !== 'Masculino' && (
              <div className="flex flex-col gap-3">
                <label className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.embarazo}
                    onChange={(e) => handleChange('embarazo', e.target.checked)}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-slate-800 text-xs font-medium">
                    Embarazo actual o posibilidad de embarazo
                  </span>
                </label>

                {form.embarazo && (
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-900 text-xs font-semibold">Semanas de gestación</label>
                    <span className="text-slate-500 text-xs">Indica el número aproximado de semanas (1 a 42), si lo conoces.</span>
                    <input
                      type="number"
                      min="1"
                      max="42"
                      value={form.semanasGestacion}
                      onChange={(e) => handleChange('semanasGestacion', e.target.value)}
                      className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {form.sexo === 'Masculino' && (
              <label className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.problemasProstaticos}
                  onChange={(e) => handleChange('problemasProstaticos', e.target.checked)}
                  className="w-4 h-4 accent-teal-700"
                />
                <span className="text-slate-800 text-xs font-medium">
                  Antecedente de problemas prostáticos (crecimiento prostático, prostatitis o retención urinaria)
                </span>
              </label>
            )}
          </section>

          {/* Paso 2: Salud y antecedentes */}
          <section className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">2. Salud y antecedentes médicos</h2>
              <p className="text-slate-600 text-xs mt-0.5">
                Marca únicamente las condiciones que correspondan a tu historial médico actual.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['diabetes', 'Diabetes mellitus'],
                ['enfermedadRenal', 'Enfermedad renal crónica'],
                ['litiasisAntecedente', 'Antecedente de cálculos renales / litiasis'],
                ['obstruccionSospechada', 'Sospecha actual de obstrucción urinaria'],
                ['inmunosupresion', 'Inmunosupresión o trasplante'],
                ['sondaUrinaria', 'Uso actual de sonda urinaria'],
                ['instrumentacionReciente', 'Instrumentación o cirugía urinaria reciente'],
                ['hospitalizacionReciente', 'Hospitalización o visita a urgencias reciente'],
                ['restriccionHidrica', 'Restricción de líquidos indicada por médico'],
                ['hipertension', 'Hipertensión arterial'],
                ['obesidad', 'Obesidad'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-slate-800 text-xs font-medium">{label}</span>
                </label>
              ))}
            </div>

            {form.enfermedadRenal && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-900 text-xs font-semibold">Detalle de enfermedad renal crónica</label>
                  <span className="text-slate-500 text-xs">
                    Anota el estadio, última creatinina o tasa de filtración glomerular estimada (eGFR), si los conoces.
                  </span>
                  <input
                    type="text"
                    value={form.enfermedadRenalDetalle}
                    onChange={(e) => handleChange('enfermedadRenalDetalle', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dialisis}
                    onChange={(e) => handleChange('dialisis', e.target.checked)}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-slate-800 text-xs font-medium">Actualmente en tratamiento de diálisis</span>
                </label>
              </div>
            )}

            {form.hospitalizacionReciente && (
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Detalle de hospitalización o urgencias</label>
                <span className="text-slate-500 text-xs">
                  Indica fecha aproximada, motivo y si recibiste antibióticos o procedimientos durante esa atención.
                </span>
                <input
                  type="text"
                  value={form.hospitalizacionDetalle}
                  onChange={(e) => handleChange('hospitalizacionDetalle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            )}
          </section>

          {/* Paso 3: Registro de episodios urinarios y síntomas actuales */}
          <section className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">3. Registro de episodios urinarios (ITU) y síntomas actuales</h2>
              <p className="text-slate-600 text-xs mt-0.5">
                Registra cada episodio urinario con fecha, tipo y nota para calcular automáticamente si cumples criterio de recurrencia (≥ 2 confirmadas en 6 meses o ≥ 3 en 12 meses).
              </p>
            </div>

            {/* Sub-bloque: Agregar episodio individual */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
              <span className="text-slate-900 text-xs font-bold">Agregar episodio urinario previo o actual</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-800 text-xs font-semibold">Fecha del episodio</label>
                  <input
                    type="date"
                    value={nuevoEpisodio.fecha}
                    onChange={(e) => setNuevoEpisodio({ ...nuevoEpisodio, fecha: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-800 text-xs font-semibold">Tipo de episodio</label>
                  <select
                    value={nuevoEpisodio.tipo}
                    onChange={(e) => setNuevoEpisodio({ ...nuevoEpisodio, tipo: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Selecciona...</option>
                    <option value="confirmado">Confirmado (evaluación médica o prueba)</option>
                    <option value="no_confirmado">Síntomas no confirmados</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-800 text-xs font-semibold">Nota breve (opcional)</label>
                  <input
                    type="text"
                    value={nuevoEpisodio.nota}
                    onChange={(e) => setNuevoEpisodio({ ...nuevoEpisodio, nota: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {epError && <span className="text-red-700 text-xs font-medium">{epError}</span>}

              <button
                type="button"
                onClick={handleAgregarEpisodio}
                className="self-start px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                + Agregar episodio a la lista
              </button>

              {form.episodiosUrinarios.length > 0 && (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                  {form.episodiosUrinarios.map((ep) => (
                    <div key={ep.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex justify-between items-center gap-3 text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {ep.fecha} · {ep.tipo === 'confirmado' ? 'Confirmado con evaluación/prueba' : 'Síntomas no confirmados'}
                        </span>
                        {ep.nota && <span className="text-slate-600">{ep.nota}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminarEpisodio(ep.id)}
                        className="text-red-700 hover:underline font-semibold shrink-0 cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cumpleRecurrencia && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-semibold">
                  Criterio de recurrencia detectado ({total6m} confirmadas en 6 meses / {total12m} en 12 meses): se registrará como modificador para seguimiento preventivo.
                </div>
              )}
            </div>

            {/* Contadores manuales por si no recuerda fechas exactas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Total ITU confirmadas (últimos 6 meses)</label>
                <span className="text-slate-500 text-xs">Se actualiza al agregar episodios arriba, o escribe el total si no recuerdas fechas exactas.</span>
                <input
                  type="number"
                  min="0"
                  value={form.ituConfirmadas6m}
                  onChange={(e) => handleChange('ituConfirmadas6m', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Total ITU confirmadas (últimos 12 meses)</label>
                <span className="text-slate-500 text-xs">Total de episodios confirmados en el último año.</span>
                <input
                  type="number"
                  min="0"
                  value={form.ituConfirmadas12m}
                  onChange={(e) => handleChange('ituConfirmadas12m', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <label className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enTratamientoItu}
                onChange={(e) => handleChange('enTratamientoItu', e.target.checked)}
                className="w-4 h-4 accent-teal-700"
              />
              <span className="text-slate-800 text-xs font-medium">
                Actualmente estoy en tratamiento o seguimiento por una infección urinaria
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Temperatura corporal actual (°C)</label>
                <span className="text-slate-500 text-xs">Valor medido con termómetro (déjalo vacío si no mediste).</span>
                <input
                  type="number"
                  step="0.1"
                  min="34"
                  max="43"
                  value={form.temperatura}
                  onChange={(e) => handleChange('temperatura', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Intensidad del dolor actual (0 a 10)</label>
                <span className="text-slate-500 text-xs">0 significa sin dolor y 10 representa el máximo dolor imaginable.</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.dolorIntensidad}
                  onChange={(e) => handleChange('dolorIntensidad', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-slate-900 text-xs font-semibold">Marca los signos o síntomas presentes hoy:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {[
                  ['sintomasUrinariosBajos', 'Ardor al orinar, urgencia o aumento de frecuencia'],
                  ['dolorFlancoLumbar', 'Dolor nuevo o creciente en costado o espalda baja'],
                  ['escalofriosTemblor', 'Escalofríos intensos con temblor'],
                  ['vomitosPersistentes', 'Vómitos persistentes que impiden beber líquidos o medicarse'],
                  ['disminucionOrina', 'Disminución importante en la cantidad de orina'],
                  ['sangreOrina', 'Sangre visible en la orina'],
                  ['coagulosRetencion', 'Coágulos en orina con dificultad para orinar'],
                  ['confusionAguda', 'Confusión o somnolencia de nueva aparición'],
                  ['desmayoODisnea', 'Desmayo, dificultad respiratoria o deterioro rápido'],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-teal-700"
                    />
                    <span className="text-slate-800 text-xs font-medium leading-snug">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Paso 4: Tratamiento, antibióticos, alergias y hábitos */}
          <section className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">4. Tratamiento actual, alergias y hábitos</h2>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Antibiótico prescrito o reciente (detalle completo)</label>
              <span className="text-slate-500 text-xs">
                Anota nombre del antibiótico, dosis, vía (oral o inyectable), fecha de inicio, duración indicada y antibióticos usados en los últimos meses.
              </span>
              <input
                type="text"
                value={form.antibioticoDetalle}
                onChange={(e) => handleChange('antibioticoDetalle', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Otros medicamentos actuales</label>
                <span className="text-slate-500 text-xs">Medicamentos de uso diario o crónico.</span>
                <input
                  type="text"
                  value={form.medicamentosActuales}
                  onChange={(e) => handleChange('medicamentosActuales', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Alergias conocidas</label>
                <span className="text-slate-500 text-xs">Especifica alergias a antibióticos u otras sustancias.</span>
                <input
                  type="text"
                  value={form.alergias}
                  onChange={(e) => handleChange('alergias', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Efectos adversos o dificultades con el tratamiento</label>
              <span className="text-slate-500 text-xs">
                Cuéntanos si has tenido malestar estomacal, alergia, olvidos o dificultad para conseguir el medicamento.
              </span>
              <input
                type="text"
                value={form.efectosAdversos}
                onChange={(e) => handleChange('efectosAdversos', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                ['miccionPostcoital', '¿Orinas tras relaciones sexuales?'],
                ['usoEspermicidas', '¿Usas espermicidas o diafragma?'],
                ['consumoArandano', '¿Consumes productos de arándano?'],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-slate-900 text-xs font-semibold">{label}</label>
                  <select
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="">Sin responder...</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                    <option value="no_aplica">No aplica</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Dudas u observaciones para la consulta</label>
              <span className="text-slate-500 text-xs">Cualquier pregunta o preferencia que quieras compartir con tu equipo tratante.</span>
              <textarea
                rows={3}
                value={form.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm resize-y"
              />
            </div>
          </section>

          {/* Paso 5: Consentimiento */}
          <section className="flex flex-col gap-3 border-t border-slate-100 pt-6">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">5. Consentimiento informado</h2>
            <label className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consentimientoNoDiagnostico}
                onChange={(e) => handleChange('consentimientoNoDiagnostico', e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-teal-700"
              />
              <span className="text-teal-950 text-xs leading-relaxed">
                <strong>Obligatorio:</strong> Entiendo que esta plataforma apoya el seguimiento y la prevención, pero no realiza diagnósticos ni prescribe tratamientos, y acepto guardar mis datos de seguimiento.
              </span>
            </label>

            <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.autorizaCompartirEquipo}
                onChange={(e) => handleChange('autorizaCompartirEquipo', e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-teal-700"
              />
              <span className="text-slate-700 text-xs leading-relaxed">
                <strong>Opcional:</strong> Autorizo compartir este resumen y alertas de seguimiento con el equipo profesional asignado en la plataforma.
              </span>
            </label>
          </section>

          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-sm font-semibold rounded-[10px] transition-colors cursor-pointer"
          >
            {loading ? 'Guardando y evaluando...' : 'Guardar evaluación clínica'}
          </button>
        </form>

        {/* Columna Secundaria */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Datos del paciente</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="text-slate-500 text-xs block">Paciente</span>
                <span className="text-slate-900 font-semibold">{usuario?.nombreCompleto || 'Sin nombre'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">RUT</span>
                <span className="text-slate-900 font-semibold">{usuario?.rut || 'Pendiente'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Edad</span>
                <span className="text-slate-900 font-semibold">{usuario?.edad ? `${usuario.edad} años` : 'No registrada'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Antecedentes registrados</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(usuario?.antecedentes?.length ? usuario.antecedentes : ['Sin antecedentes registrados']).map((a, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Últimas evaluaciones</h3>
            {historialEval.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {historialEval.slice(0, 3).map((ev) => {
                  const meta = PRIORIDAD_META[ev.nivel_prioridad] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
                  return (
                    <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${meta.badge}`}>
                          {meta.short}
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(ev.fecha_evaluacion).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs line-clamp-2">{ev.recomendacion}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-xs">Aún no has enviado evaluaciones.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}