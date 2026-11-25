import React, { useEffect, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { api, getStoredUser } from '../services/api';

export default function PatientRecordatorios() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [recordatorios, setRecordatorios] = useState([]);
  const [usuario, setUsuario] = useState(getStoredUser());
  const [proximaCita, setProximaCita] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nuevo, setNuevo] = useState({ titulo: '', descripcion: '', frecuencia: 'Diario', fechaProgramada: '' });

  const pacienteId = getStoredUser()?.id || 3;

  const cargar = async () => {
    try {
      const [recs, u, atenciones] = await Promise.all([
        api.getRecordatoriosPaciente(pacienteId),
        api.getUsuario(pacienteId),
        api.getAtencionesPaciente(pacienteId),
      ]);
      setRecordatorios(recs || []);
      setUsuario(u);
      setProximaCita((atenciones || []).find((a) => a.estado === 'En proceso') || null);
    } catch (err) {
      console.error('Error cargando recordatorios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCompletar = async (id) => {
    try {
      await api.completarRecordatorio(id);
      setRecordatorios((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(`Error al completar: ${err.message}`);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevo.titulo.trim()) return;
    setSaving(true);
    try {
      await api.crearRecordatorio({
        paciente_id: pacienteId,
        tipo: 'cuidado',
        titulo: nuevo.titulo.trim(),
        descripcion: nuevo.descripcion.trim() || 'Recordatorio personal de autocuidado.',
        frecuencia: nuevo.frecuencia,
        prioridad: nuevo.frecuencia === 'Alarma' ? 'Alta' : 'Media',
        fecha_programada: nuevo.fechaProgramada.trim() || 'Hoy',
        activo: true,
      });
      setNuevo({ titulo: '', descripcion: '', frecuencia: 'Diario', fechaProgramada: '' });
      setShowNew(false);
      await cargar();
    } catch (err) {
      alert(`Error al crear recordatorio: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
            Recordatorios para cuidar tu salud
          </h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Organiza tus recordatorios de tratamiento, mediciones y controles indicados por tu equipo tratante.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowNew((v) => !v)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            {showNew ? 'Cerrar' : '+ Nuevo recordatorio'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
              <span className="text-slate-900 text-xs font-medium">{recordatorios.length} activos</span>
            </button>
            <NotificationsMenu isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>
        </div>
      </div>

      {/* Formulario Nuevo Recordatorio */}
      {showNew && (
        <form onSubmit={handleCrear} className="bg-white rounded-2xl border border-teal-200 p-6 flex flex-col gap-4 shadow-sm">
          <h2 className="text-slate-900 text-base font-bold">Crear recordatorio personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Título del recordatorio</label>
              <span className="text-[11px] text-slate-500">Ej. Tomar antibiótico nocturno o medir temperatura</span>
              <input
                type="text"
                required
                value={nuevo.titulo}
                onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Frecuencia</label>
              <span className="text-[11px] text-slate-500">Con qué periodicidad se repite</span>
              <select
                value={nuevo.frecuencia}
                onChange={(e) => setNuevo({ ...nuevo, frecuencia: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              >
                <option value="Diario">Diario</option>
                <option value="Alarma">Alarma</option>
                <option value="Semanal">Semanal</option>
                <option value="Puntual">Puntual</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Horario o referencia</label>
              <span className="text-[11px] text-slate-500">Ej. Hoy · 20:00 hrs</span>
              <input
                type="text"
                value={nuevo.fechaProgramada}
                onChange={(e) => setNuevo({ ...nuevo, fechaProgramada: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-800">Detalle o nota</label>
            <input
              type="text"
              value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar recordatorio'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Lista de Recordatorios */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">Recordatorios activos de cuidado</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Estos recordatorios apoyan tu adherencia y no reemplazan las indicaciones específicas del profesional.
              </p>
            </div>

            {loading ? (
              <p className="text-xs text-slate-500">Cargando recordatorios...</p>
            ) : recordatorios.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No tienes recordatorios pendientes por ahora.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recordatorios.map((rec) => {
                  const isAlarma = rec.frecuencia === 'Alarma' || rec.prioridad === 'Alta';
                  return (
                    <div
                      key={rec.id}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-[10px] flex justify-center items-center shrink-0 text-xs font-bold ${isAlarma ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-800'}`}>
                          {isAlarma ? '!' : 'R'}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-slate-900 text-sm font-semibold">{rec.titulo}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isAlarma ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-800'}`}>
                              {rec.frecuencia}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs leading-snug">{rec.descripcion}</p>
                          {rec.fecha_programada && (
                            <span className="text-slate-400 text-[10px]">Programado: {rec.fecha_programada}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCompletar(rec.id)}
                        className="px-3.5 py-2 bg-white hover:bg-teal-50 border border-slate-300 hover:border-teal-600 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Marcar listo
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">Próxima cita registrada</h2>
            {proximaCita ? (
              <div className="flex flex-col gap-1">
                <h3 className="text-slate-900 text-sm font-semibold">{proximaCita.titulo}</h3>
                <p className="text-slate-500 text-xs">
                  {proximaCita.profesional?.nombre_completo || 'Equipo médico'} · {proximaCita.modalidad} ·{' '}
                  {new Date(proximaCita.fecha_hora).toLocaleString('es-CL')}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">No hay atenciones próximas en curso.</p>
            )}
            <a
              href="#paciente/atenciones"
              className="w-full mt-2 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold text-center"
            >
              Ver mis atenciones
            </a>
          </section>
        </div>

        {/* Columna Secundaria */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Datos del paciente</h3>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-slate-500 text-xs font-semibold block">Paciente</span>
                <span className="text-slate-900 text-sm font-semibold">{usuario?.nombreCompleto || 'Sin nombre'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-semibold block">RUT</span>
                <span className="text-slate-900 text-sm font-semibold">{usuario?.rut || 'Pendiente'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-semibold block">Meta de líquidos</span>
                <span className="text-slate-900 text-xs font-semibold">
                  {usuario?.restriccionHidrica
                    ? `Restricción activa (${usuario.metaHidricaMl || 'según indicación'} mL máx.)`
                    : `${usuario?.metaHidricaMl || 1750} mL/día (1 vaso = 250 mL)`}
                </span>
              </div>
            </div>
            <a
              href="#paciente/tratamiento-activo"
              className="w-full mt-2 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold text-center"
            >
              Ir a tratamiento en curso
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}