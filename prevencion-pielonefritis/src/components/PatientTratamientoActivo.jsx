import React, { useEffect, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META, formatearHidratacion } from '../services/clinicalEngine';

const CHECKIN_INICIAL = {
  temperatura: '',
  dolorLumbar: '',
  dolorLocalizacion: '',
  dolorEvolucion: '',
  mlHidratacion: '',
  glucosaCapilar: '',
  tomoTratamiento: '',
  efectosAdversos: '',
  dolorFlanco: false,
  escalofriosTemblor: false,
  vomitosPersistentes: false,
  disminucionOrina: false,
  sintomasUrinarios: false,
  sangreOrina: false,
  coagulosRetencion: false,
  confusionODeterioro: false,
  comentario: '',
};

export default function PatientTratamientoActivo() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [derivacionNotificada, setDerivacionNotificada] = useState(false);

  const [usuario, setUsuario] = useState(getStoredUser());
  const [seguimiento, setSeguimiento] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [checkinForm, setCheckinForm] = useState(CHECKIN_INICIAL);

  const cargarTodo = async () => {
    try {
      const pacienteId = getStoredUser()?.id || 3;
      const [u, seg, exs] = await Promise.all([
        api.getUsuario(pacienteId),
        api.getSeguimientoPaciente(pacienteId),
        api.getExamenesPaciente(pacienteId),
      ]);
      setUsuario(u);
      setSeguimiento(seg);
      setExamenes(exs || []);

      if (seg?.id) {
        const hist = await api.getCheckins(seg.id);
        setCheckins(hist || []);
      }
    } catch (err) {
      console.error('Error cargando tratamiento activo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const handleSubmitCheckin = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setDerivacionNotificada(false);

    try {
      const pacienteId = usuario?.id || getStoredUser()?.id || 3;
      const actualizado = await api.registrarCheckin(pacienteId, {
        ...checkinForm,
        toleraLiquidosMedicamentos: !checkinForm.vomitosPersistentes,
        tomoTratamiento: checkinForm.tomoTratamiento === '' ? true : checkinForm.tomoTratamiento !== 'no',
      });
      setSeguimiento(actualizado);
      const hist = await api.getCheckins(actualizado.id);
      setCheckins(hist || []);
      setCheckinForm(CHECKIN_INICIAL);
      setShowForm(false);
      setDerivacionNotificada(Boolean(actualizado.derivacionActivada));
      setFeedback('Chequeo diario registrado con fecha y hora. Semáforo actualizado.');
    } catch (err) {
      setFeedback(`Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const primerNombre = (usuario?.nombreCompleto || 'Paciente').split(' ')[0];
  const nivel = seguimiento?.nivel_semaforo || 'INFORMACION_INSUFICIENTE';
  const meta = PRIORIDAD_META[nivel] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
  const esDiabetico = usuario?.antecedentes?.some((a) => a.toLowerCase().includes('diabetes'));
  const progresoPorcentaje = seguimiento
    ? Math.min(100, Math.round(((seguimiento.dia_actual || 1) / (seguimiento.total_dias || 7)) * 100))
    : 0;

  const metaMl = Number(usuario?.metaHidricaMl || 1750);
  const mlActual = Number(seguimiento?.ml_hidratacion || 0);
  const alcanzoMetaSegura = !usuario?.restriccionHidrica && mlActual >= metaMl && mlActual > 0;
  const limitesNut = usuario?.limites_nutricionales || {};
  const tieneLimitesNut = Boolean(limitesNut.sodio || limitesNut.proteinas || limitesNut.carbohidratos);

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-100 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-500 text-sm font-medium">Cargando seguimiento en curso...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto pb-16 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <span className="self-start px-2.5 py-0.5 bg-teal-700 text-white text-[10px] font-bold rounded uppercase">
            SEGUIMIENTO EN CURSO
          </span>
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Hola, {primerNombre}</h1>
          <p className="text-slate-600 text-sm font-normal font-['Inter']">
            {seguimiento
              ? `Seguimiento activo: ${seguimiento.diagnostico}. Registra tus síntomas diarios para mantener informado a tu equipo de salud.`
              : 'Registra tu chequeo diario de síntomas e hidratación para activar el seguimiento.'}
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">Notificaciones</span>
          </button>
          <NotificationsMenu isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Aviso de Derivación Automática */}
      {derivacionNotificada && (
        <div className="p-4 bg-red-50 border-2 border-red-400 rounded-2xl flex flex-col gap-1">
          <span className="text-red-900 text-xs font-bold uppercase">
            Derivación automática activada · Todos notificados
          </span>
          <p className="text-red-800 text-sm">
            Tu equipo profesional recibió esta alerta prioritaria en su Centro de Comando y bandeja de mensajes, y se creó un recordatorio en tu cuenta. Sigue las indicaciones de seguridad sin suspender tu tratamiento por cuenta propia.
          </p>
        </div>
      )}

      {/* Semáforo Actual */}
      <div className={`p-6 bg-white rounded-2xl border-2 ${meta.border} shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4`}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${meta.badge}`}>
              {meta.label}
            </span>
            {seguimiento?.ultimo_checkin_at && (
              <span className="text-slate-500 text-xs">
                Último registro: {new Date(seguimiento.ultimo_checkin_at).toLocaleString('es-CL')}
              </span>
            )}
          </div>
          <p className="text-slate-800 text-sm leading-relaxed max-w-3xl">
            {seguimiento?.mensaje_protocolo || 'Aún no hay registros completos hoy.'}
          </p>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shrink-0 cursor-pointer"
        >
          {showForm ? 'Cerrar formulario' : 'Registrar chequeo de hoy'}
        </button>
      </div>

      {/* Mensaje de logro hidratación (SOLO sin restricción hídrica) */}
      {alcanzoMetaSegura && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-emerald-900 text-xs font-bold uppercase">Meta diaria alcanzada</span>
            <p className="text-emerald-800 text-sm">
              ¡Buen trabajo! Registraste {formatearHidratacion(mlActual)}, cumpliendo tu meta individual de {metaMl} mL/día.
            </p>
          </div>
        </div>
      )}

      {/* Alerta Metabólica Paralela */}
      {seguimiento?.alerta_metabolica && seguimiento.alerta_metabolica !== 'NINGUNA' && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col gap-1">
          <span className="text-amber-900 text-xs font-bold uppercase">Alerta metabólica paralela (Glucosa)</span>
          <p className="text-amber-800 text-sm">{seguimiento.mensaje_metabolico}</p>
        </div>
      )}

      {/* Formulario Real de Check-in Diario (0 valores predeterminados, 0 instrucciones en placeholder) */}
      {showForm && (
        <form onSubmit={handleSubmitCheckin} className="p-6 bg-white rounded-2xl border border-teal-200 shadow-sm flex flex-col gap-5">
          <div>
            <h2 className="text-slate-900 text-lg font-bold">Nuevo chequeo diario</h2>
            <p className="text-slate-600 text-xs mt-0.5">
              Completa con tus mediciones reales de hoy. Las indicaciones permanecen siempre visibles sobre cada recuadro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Temperatura (°C)</label>
              <span className="text-slate-500 text-xs">Medida con termómetro (en °C, con punto decimal).</span>
              <input
                type="number"
                step="0.1"
                min="34"
                max="43"
                value={checkinForm.temperatura}
                onChange={(e) => setCheckinForm({ ...checkinForm, temperatura: e.target.value })}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Intensidad del dolor (0 a 10)</label>
              <span className="text-slate-500 text-xs">0 = sin dolor · 10 = dolor máximo.</span>
              <input
                type="number"
                min="0"
                max="10"
                value={checkinForm.dolorLumbar}
                onChange={(e) => setCheckinForm({ ...checkinForm, dolorLumbar: e.target.value })}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Líquidos ingeridos hoy (mL)</label>
              <span className="text-slate-500 text-xs">Convención: 1 vaso de referencia = 250 mL.</span>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={checkinForm.mlHidratacion}
                  onChange={(e) => setCheckinForm({ ...checkinForm, mlHidratacion: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setCheckinForm((p) => ({ ...p, mlHidratacion: String((Number(p.mlHidratacion) || 0) + 250) }))
                  }
                  className="px-2.5 py-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                  title="Sumar 1 vaso (250 mL)"
                >
                  +250
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">
                Glucosa capilar (mg/dL) {esDiabetico ? '' : '(opcional)'}
              </label>
              <span className="text-slate-500 text-xs">Ingresa el valor si cuentas con medición capilar hoy.</span>
              <input
                type="number"
                min="20"
                max="700"
                value={checkinForm.glucosaCapilar}
                onChange={(e) => setCheckinForm({ ...checkinForm, glucosaCapilar: e.target.value })}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Localización del dolor (si tienes)</label>
              <span className="text-slate-500 text-xs">Indica dónde se concentra principalmente la molestia.</span>
              <select
                value={checkinForm.dolorLocalizacion}
                onChange={(e) => setCheckinForm({ ...checkinForm, dolorLocalizacion: e.target.value })}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Selecciona una opción...</option>
                <option value="Sin dolor">Sin dolor</option>
                <option value="Zona pélvica / vejiga">Zona pélvica / bajo vientre</option>
                <option value="Costado o espalda baja (flanco/lumbar)">Costado o espalda baja (flanco / lumbar)</option>
                <option value="Dolor tipo cólico intenso">Dolor tipo cólico</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Evolución comparada con ayer</label>
              <span className="text-slate-500 text-xs">Indica cómo han cambiado tus síntomas respecto al día previo.</span>
              <select
                value={checkinForm.dolorEvolucion}
                onChange={(e) => setCheckinForm({ ...checkinForm, dolorEvolucion: e.target.value })}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Selecciona una opción...</option>
                <option value="Mejorando">Mejorando</option>
                <option value="Igual">Sin cambios</option>
                <option value="Empeorando">Empeorando / dolor nuevo</option>
              </select>
            </div>
          </div>

          {/* Adherencia */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 text-xs font-semibold">
              ¿Pudiste tomar las dosis indicadas por tu equipo de salud hoy?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                ['si', 'Sí, tomé mis dosis'],
                ['no', 'Omití una o más dosis / tuve dificultades'],
              ].map(([val, text]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCheckinForm({ ...checkinForm, tomoTratamiento: val })}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                    checkinForm.tomoTratamiento === val
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Signos de alarma adicionales */}
          <div className="flex flex-col gap-2">
            <span className="text-slate-900 text-xs font-semibold">Marca solo si presentas hoy alguno de estos signos:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[
                ['sintomasUrinarios', 'Ardor, urgencia o frecuencia al orinar'],
                ['dolorFlanco', 'Dolor nuevo o creciente en costado / espalda baja'],
                ['escalofriosTemblor', 'Escalofríos intensos con temblor'],
                ['vomitosPersistentes', 'Vómitos persistentes que impiden hidratarme o medicarme'],
                ['disminucionOrina', 'Disminución importante de la cantidad de orina'],
                ['sangreOrina', 'Sangre visible en la orina'],
                ['coagulosRetencion', 'Coágulos con dificultad para orinar'],
                ['confusionODeterioro', 'Confusión nueva, desmayo o dificultad respiratoria'],
              ].map(([key, label]) => (
                <label key={key} className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkinForm[key]}
                    onChange={(e) => setCheckinForm({ ...checkinForm, [key]: e.target.checked })}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-slate-700 text-xs font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Efectos adversos (opcional)</label>
              <span className="text-slate-500 text-xs">Registra náuseas, molestias gástricas, erupciones o barreras para tomar tu dosis.</span>
              <input
                type="text"
                value={checkinForm.efectosAdversos}
                onChange={(e) => setCheckinForm({ ...checkinForm, efectosAdversos: e.target.value })}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-900 text-xs font-semibold">Comentario adicional (opcional)</label>
              <span className="text-slate-500 text-xs">Anota cualquier detalle relevante para tu profesional.</span>
              <input
                type="text"
                value={checkinForm.comentario}
                onChange={(e) => setCheckinForm({ ...checkinForm, comentario: e.target.value })}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar chequeo diario'}
            </button>
          </div>
        </form>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Plan indicado + límites nutricionales individuales */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-slate-900 text-lg font-bold">Seguimiento del plan indicado</h3>
                <span className="text-slate-500 text-xs">
                  La duración y ajustes del tratamiento dependen exclusivamente de tu equipo médico.
                </span>
              </div>
              {seguimiento && (
                <span className="text-teal-700 text-sm font-bold">
                  Día {seguimiento.dia_actual || 1} de {seguimiento.total_dias || 7}
                </span>
              )}
            </div>

            {seguimiento && (
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: `${progresoPorcentaje}%` }} />
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase">Tratamiento registrado</span>
                <p className="text-slate-900 text-sm font-bold">{seguimiento?.antibiotico_actual || 'Sin tratamiento activo registrado'}</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  No suspendas ni reutilices antibióticos sobrantes; ante cualquier duda consulta con tu equipo.
                </p>
              </div>
              <a
                href="#paciente/mensajes"
                className="self-start sm:self-center px-4 py-2 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-semibold shrink-0"
              >
                Consultar al equipo
              </a>
            </div>

            {tieneLimitesNut && (
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex flex-col gap-1.5">
                <span className="text-teal-900 text-xs font-bold uppercase">
                  Metas o límites nutricionales indicados por tu equipo
                </span>
                <div className="flex flex-wrap gap-3 text-xs text-teal-950">
                  {limitesNut.sodio && <span><strong>Sodio:</strong> {limitesNut.sodio}</span>}
                  {limitesNut.proteinas && <span><strong>Proteínas:</strong> {limitesNut.proteinas}</span>}
                  {limitesNut.carbohidratos && <span><strong>Carbohidratos:</strong> {limitesNut.carbohidratos}</span>}
                </div>
                {limitesNut.indicacion && <p className="text-xs text-teal-800">{limitesNut.indicacion}</p>}
              </div>
            )}
          </section>

          {/* Tendencias de hidratación y síntomas (Descriptivo, NO causal) */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div>
              <h3 className="text-slate-900 text-lg font-bold">Tendencias de hidratación y síntomas</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Registro descriptivo con fecha y hora (en mL y L). La hidratación apoya el cuidado según tu plan individual, pero no sustituye el tratamiento ni la valoración médica.
              </p>
            </div>

            {usuario?.restriccionHidrica ? (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
                Restricción hídrica activa (límite máximo {metaMl} mL/día): {usuario.metaHidricaNota || 'No modifiques tu límite de líquidos sin indicación médica.'}
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Meta diaria individual: <strong>{formatearHidratacion(metaMl)}</strong> (salvo indicación distinta de tu equipo).
              </p>
            )}

            {checkins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2 pr-3">Fecha / hora</th>
                      <th className="py-2 pr-3">Temp.</th>
                      <th className="py-2 pr-3">Dolor</th>
                      <th className="py-2 pr-3">Líquidos (mL / L)</th>
                      <th className="py-2 pr-3">Glucosa</th>
                      <th className="py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkins.map((c) => {
                      const cMeta = PRIORIDAD_META[c.nivel_semaforo_resultante] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
                      return (
                        <tr key={c.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-2.5 pr-3 text-slate-700">
                            {new Date(c.created_at).toLocaleString('es-CL', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 pr-3 font-semibold text-slate-900">
                            {c.temperatura != null ? `${c.temperatura} °C` : '—'}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-700">
                            {c.dolor_lumbar != null ? `${c.dolor_lumbar}/10` : '—'}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-700">
                            {c.ml_hidratacion != null ? formatearHidratacion(c.ml_hidratacion) : '—'}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-700">
                            {c.glucosa_capilar != null ? `${c.glucosa_capilar} mg/dL` : '—'}
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${cMeta.badge}`}>
                              {cMeta.short}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">Aún no hay chequeos diarios registrados.</p>
            )}
          </section>
        </div>

        {/* Columna Derecha */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <section className="p-6 bg-red-50 rounded-2xl border border-red-200 flex flex-col gap-3">
            <h3 className="text-red-800 text-base font-bold">Señales de alarma</h3>
            <div className="bg-white p-3 rounded-xl border border-red-200 flex flex-col gap-1">
              <span className="text-red-700 text-xs font-bold uppercase">Urgencias inmediatas</span>
              <p className="text-slate-700 text-xs leading-relaxed">
                Confusión o somnolencia nueva, desmayo, dificultad respiratoria, coágulos con retención urinaria o deterioro rápido: acude a urgencias o llama a emergencias sin esperar a que aparezcan todos los signos.
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col gap-1">
              <span className="text-amber-800 text-xs font-bold uppercase">Valoración presencial hoy</span>
              <p className="text-slate-700 text-xs leading-relaxed">
                Fiebre ≥ 38 °C, escalofríos intensos con temblor, dolor nuevo o creciente en costado/espalda baja, vómitos que impidan hidratarse o tomar el tratamiento, embarazo con síntomas o falta de mejoría en 48–72 horas.
              </p>
            </div>
          </section>

          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-900 text-base font-bold">Tus exámenes</h3>
              <a href="#paciente/examenes" className="text-teal-700 text-xs font-semibold hover:underline">
                Subir examen
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {examenes.length > 0 ? (
                examenes.slice(0, 4).map((ex) => (
                  <div key={ex.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 flex flex-col gap-1">
                    <span className="text-slate-900 text-sm font-semibold truncate">{ex.nombre_archivo || ex.tipo_examen}</span>
                    <span className="text-slate-500 text-xs">{ex.estado}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs">No tienes exámenes cargados aún.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}