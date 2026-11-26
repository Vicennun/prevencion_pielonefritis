import React, { useEffect, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META } from '../services/clinicalEngine';

export default function ProDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  const [atenciones, setAtenciones] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [examenesPendientes, setExamenesPendientes] = useState([]);

  const proUser = getStoredUser();
  const proId = proUser?.id || 1;
  const primerNombre = (proUser?.nombreCompleto || 'Profesional')
    .replace(/^(Dr\.|Dra\.)\s*/i, '')
    .split(' ')[0];

  useEffect(() => {
    const cargar = async () => {
      try {
        const [ats, segs, msgs, recs, exs] = await Promise.all([
          api.getTodasAtenciones(),
          api.getSeguimientos(),
          api.getMensajesUsuario(proId),
          api.getTodosRecordatorios(),
          api.getExamenesPendientes(),
        ]);
        setAtenciones(ats || []);
        setSeguimientos(segs || []);
        setMensajes(msgs || []);
        setRecordatorios(recs || []);
        setExamenesPendientes(exs || []);
      } catch (err) {
        console.error('Error cargando dashboard profesional:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [proId]);

  const hoy = new Date();
  const diaCorto = hoy.toLocaleDateString('es-CL', { weekday: 'short' }).replace('.', '');
  const fechaCorta = hoy.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const urgentesCount = seguimientos.filter(
    (s) => s.nivel_semaforo === 'URGENCIA_INMEDIATA' || s.nivel_semaforo === 'ROJO'
  ).length;

  const mensajesRecibidos = mensajes.filter((m) => m.destinatario_id === proId);
  const noLeidos = mensajesRecibidos.filter((m) => !m.leido).length;

  const getEstadoBadge = (estado) => {
    if (estado === 'En proceso') return 'bg-blue-100 text-blue-700';
    if (estado === 'Completado') return 'bg-green-100 text-green-700';
    return 'bg-slate-200 text-slate-600';
  };

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-600 text-sm font-medium font-['Inter']">Cargando panel profesional...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-blue-800 text-3xl font-bold font-['Inter']">Saludos, {primerNombre}</h1>
          <p className="text-slate-600 text-sm font-normal font-['Inter']">
            Panel de gestión clínica · Seguimiento y prevención de pielonefritis
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-red-700 text-2xl font-bold font-['Inter'] capitalize pr-2">{diaCorto}.</span>
            <span className="text-red-700 text-xl font-bold font-['Inter']">{fechaCorta}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="px-3.5 py-2.5 bg-zinc-100 hover:bg-white rounded-full border border-zinc-300 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
              <span className="text-red-700 text-xs font-semibold font-['Inter']">
                {recordatorios.length} alertas/tareas
              </span>
            </button>
            <NotificationsMenu isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>
        </div>
      </div>

      {/* Banner de Prioridad Inmediata */}
      {urgentesCount > 0 && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-red-800 text-sm font-bold">
              {urgentesCount} paciente(s) con criterios de Urgencia Inmediata o Valoración Hoy
            </span>
            <span className="text-red-700 text-xs">
              Revisa el Monitor Clínico ordenado por reglas deterministas para priorizar atención presencial.
            </span>
          </div>
          <a
            href="#profesional/seguimiento-activo"
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shrink-0"
          >
            Abrir Monitor Clínico
          </a>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Columna Izquierda */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Panel de Pacientes Priorizados por Semáforo */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <h2 className="text-blue-800 text-lg font-bold font-['Inter']">Pacientes prioritarios en seguimiento</h2>
                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {seguimientos.length} activos
                </span>
              </div>
              <a href="#profesional/pacientes" className="text-slate-600 hover:text-red-700 text-xs font-semibold hover:underline">
                Ver todos
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {seguimientos.slice(0, 3).map((seg) => {
                const meta = PRIORIDAD_META[seg.nivel_semaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
                return (
                  <a
                    key={seg.id}
                    href={`#profesional/seguimiento-activo/${seg.paciente_id}`}
                    className="p-4 bg-white rounded-xl border border-zinc-200 hover:border-red-400 transition-colors flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-slate-900 text-sm font-bold leading-tight">
                        {seg.paciente?.nombreCompleto || 'Paciente'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase shrink-0 ${meta.badge}`}>
                        {meta.short}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-2">{seg.diagnostico}</p>
                    <span className="text-slate-500 text-[11px] mt-auto">
                      Temp: {seg.temperatura_actual != null ? `${seg.temperatura_actual} °C` : '—'} · Dolor: {seg.dolor_lumbar_actual != null ? `${seg.dolor_lumbar_actual}/10` : '—'}
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Últimas Atenciones */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-blue-800 text-lg font-bold font-['Inter']">Atenciones recientes</h2>
              <a href="#profesional/historial" className="text-slate-600 hover:text-red-700 text-xs font-semibold hover:underline">
                Ver historial
              </a>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {atenciones.slice(0, 4).map((item) => (
                <a
                  key={item.id}
                  href={`#profesional/detalle-atencion/${item.id}`}
                  className="px-4 py-3.5 bg-white hover:bg-slate-50 rounded-xl border border-zinc-200 flex justify-between items-center gap-4 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-slate-900 text-sm font-semibold truncate">{item.titulo}</span>
                    <span className="text-slate-500 text-xs truncate">
                      {item.paciente?.nombre_completo || 'Paciente'} · {new Date(item.fecha_hora).toLocaleDateString('es-CL')} · {item.modalidad}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${getEstadoBadge(item.estado)}`}>
                    {item.estado}
                  </span>
                </a>
              ))}
              {atenciones.length === 0 && (
                <p className="text-slate-500 text-xs">No hay atenciones registradas aún.</p>
              )}
            </div>
          </section>
        </div>

        {/* Columna Derecha */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Exámenes pendientes de revisión */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-800 text-base font-bold font-['Inter']">Urocultivos y exámenes</h2>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                {examenesPendientes.length} pendientes
              </span>
            </div>
            <p className="text-slate-600 text-xs">
              Resultados cargados por pacientes esperando transcripción clínica y conducta documentada.
            </p>
            <a
              href={
                examenesPendientes[0]
                  ? `#profesional/revision-examen/${examenesPendientes[0].id}`
                  : '#profesional/revision-examen'
              }
              className="w-full mt-1 px-4 py-3 bg-red-700 hover:bg-red-800 transition-colors rounded-[10px] text-white text-sm font-semibold text-center"
            >
              Revisar exámenes pendientes
            </a>
          </section>

          {/* Mensajes Recientes */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-800 text-lg font-bold font-['Inter']">Mensajes</h2>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                {noLeidos} sin leer
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {mensajesRecibidos.slice(0, 3).map((m) => (
                <li key={m.id} className="p-2.5 bg-white rounded-lg border border-zinc-200 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900 block truncate">
                    {m.remitente?.nombre_completo || 'Paciente'}
                  </span>
                  <span className="text-slate-500 line-clamp-1">{m.contenido}</span>
                </li>
              ))}
              {mensajesRecibidos.length === 0 && (
                <li className="text-xs text-slate-500">Sin mensajes recientes.</li>
              )}
            </ul>
            <a href="#profesional/mensajes" className="text-red-700 text-xs font-semibold hover:underline self-start">
              Abrir bandeja de entrada ›
            </a>
          </section>

          {/* Tareas y Recordatorios */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-800 text-base font-bold font-['Inter']">Centro de Comando</h2>
              <a href="#profesional/recordatorios" className="text-slate-600 text-xs font-semibold hover:underline">
                Gestionar
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              {recordatorios.slice(0, 3).map((rec) => (
                <div key={rec.id} className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 mt-1.5 rounded-sm shrink-0 ${rec.prioridad === 'Alta' ? 'bg-red-700' : 'bg-stone-500'}`} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-slate-900 text-xs font-semibold truncate">{rec.titulo}</span>
                    <span className="text-slate-500 text-[11px] truncate">
                      {rec.paciente?.nombre_completo || 'General'} · {rec.fecha_programada || rec.frecuencia}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}