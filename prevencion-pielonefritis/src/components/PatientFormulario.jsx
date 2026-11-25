import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META } from '../services/clinicalEngine';

const INITIAL_FORM = {
  // Antecedentes y modificadores
  embarazo: false,
  semanasGestacion: '',
  diabetes: false,
  enfermedadRenal: false,
  enfermedadRenalDetalle: '',
  litiasisAntecedente: false,
  obstruccionSospechada: false,
  inmunosupresion: false,
  sondaUrinaria: false,
  instrumentacionReciente: false,
  restriccionHidrica: false,
  ituConfirmadas6m: '',
  ituConfirmadas12m: '',
  // Síntomas actuales (sin valores predeterminados)
  temperatura: '',
  dolorIntensidad: '',
  dolorFlancoLumbar: false,
  escalofriosTemblor: false,
  vomitosPersistentes: false,
  sintomasUrinariosBajos: false,
  sangreOrina: false,
  coagulosRetencion: false,
  confusionAguda: false,
  desmayoODisnea: false,
  // Otros datos
  alergias: '',
  medicamentosActuales: '',
  observaciones: '',
};

export default function PatientFormulario() {
  const [usuario, setUsuario] = useState(getStoredUser());
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultadoGuardado, setResultadoGuardado] = useState(null);
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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const pacienteId = usuario?.id || getStoredUser()?.id || 3;
      const { evaluacion, resultado } = await api.crearEvaluacion(pacienteId, form);
      setResultadoGuardado(resultado);
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
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
          Evaluación clínica y antecedentes urinarios
        </h1>
        <p className="text-slate-500 text-sm font-normal font-['Inter']">
          Registra tus antecedentes y síntomas actuales para orientar el seguimiento. Esta herramienta no realiza diagnósticos ni reemplaza la evaluación médica.
        </p>
      </div>

      {/* Resultado tras enviar */}
      {resultadoGuardado && metaResultado && (
        <div className={`p-5 bg-white rounded-2xl border-2 ${metaResultado.border} shadow-sm flex flex-col gap-2`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${metaResultado.badge}`}>
              {metaResultado.label}
            </span>
            <span className="text-slate-500 text-xs font-medium">Evaluación guardada en tu historial</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{resultadoGuardado.mensajeProtocolo}</p>
          {resultadoGuardado.triggersActivos?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
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
        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-8">
          {/* Bloque 1: Antecedentes */}
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">1. Antecedentes y condiciones relevantes</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Marca solo las condiciones que correspondan a tu historial médico actual.
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
                ['restriccionHidrica', 'Tengo restricción de líquidos indicada por médico'],
                ['embarazo', 'Embarazo o posibilidad de embarazo'],
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

            {form.embarazo && (
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 text-xs font-semibold">Semanas de gestación</label>
                <p className="text-slate-500 text-xs">Indica el número aproximado de semanas (si lo conoces).</p>
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

            {form.enfermedadRenal && (
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 text-xs font-semibold">Detalle de enfermedad renal</label>
                <p className="text-slate-500 text-xs">Indica estadio, última creatinina/filtración glomerular estimada o si estás en diálisis.</p>
                <input
                  type="text"
                  value={form.enfermedadRenalDetalle}
                  onChange={(e) => handleChange('enfermedadRenalDetalle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 text-xs font-semibold">Infecciones urinarias en los últimos 6 meses</label>
                <p className="text-slate-500 text-xs">Escribe el número de episodios confirmados (0 si no has tenido).</p>
                <input
                  type="number"
                  min="0"
                  value={form.ituConfirmadas6m}
                  onChange={(e) => handleChange('ituConfirmadas6m', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 text-xs font-semibold">Infecciones urinarias en los últimos 12 meses</label>
                <p className="text-slate-500 text-xs">Escribe el total de episodios confirmados en el último año.</p>
                <input
                  type="number"
                  min="0"
                  value={form.ituConfirmadas12m}
                  onChange={(e) => handleChange('ituConfirmadas12m', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </section>

          {/* Bloque 2: Síntomas actuales */}
          <section className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">2. Síntomas y mediciones actuales</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Si no cuentas con una medición, déjala en blanco: el sistema indicará «Información insuficiente» en lugar de asumir normalidad.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 text-xs font-semibold">Temperatura corporal actual (°C)</label>
                <p className="text-slate-500 text-xs">Ingresa el valor medido con termómetro (ej. 36.8 o 38.4).</p>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 text-xs font-semibold">Intensidad del dolor (escala 0 a 10)</label>
                <p className="text-slate-500 text-xs">0 significa sin dolor y 10 el máximo dolor imaginable.</p>
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
              <span className="text-slate-900 text-xs font-semibold">Marca los síntomas presentes hoy:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {[
                  ['sintomasUrinariosBajos', 'Ardor al orinar, urgencia o aumento de frecuencia'],
                  ['dolorFlancoLumbar', 'Dolor nuevo o creciente en costado / espalda baja'],
                  ['escalofriosTemblor', 'Escalofríos intensos con temblor'],
                  ['vomitosPersistentes', 'Vómitos persistentes que impiden beber líquidos o medicamentos'],
                  ['sangreOrina', 'Sangre visible en la orina'],
                  ['coagulosRetencion', 'Coágulos en orina con dificultad para orinar'],
                  ['confusionAguda', 'Confusión nueva o somnolencia inusual'],
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

          {/* Bloque 3: Medicamentos y alergias */}
          <section className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">3. Medicamentos, alergias y comentarios</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 text-xs font-semibold">Medicamentos y antibióticos actuales o recientes</label>
              <p className="text-slate-500 text-xs">Indica nombre, dosis, fecha de inicio y si has tenido dificultades para tomarlos.</p>
              <input
                type="text"
                value={form.medicamentosActuales}
                onChange={(e) => handleChange('medicamentosActuales', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 text-xs font-semibold">Alergias conocidas</label>
              <p className="text-slate-500 text-xs">Especifica alergias a antibióticos (ej. penicilina, sulfas) u otras sustancias.</p>
              <input
                type="text"
                value={form.alergias}
                onChange={(e) => handleChange('alergias', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 text-xs font-semibold">Observaciones para tu profesional</label>
              <p className="text-slate-500 text-xs">Dudas, efectos adversos o cualquier cambio relevante en tus síntomas.</p>
              <textarea
                rows={3}
                value={form.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm resize-y"
              />
            </div>
          </section>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">{error}</div>
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
                        <span className="text-slate-400 text-[10px]">
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