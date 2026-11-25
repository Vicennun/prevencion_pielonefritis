import React, { useEffect, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META, formatearHidratacion } from '../services/clinicalEngine';

export default function PatientDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(getStoredUser());
  const [seguimiento, setSeguimiento] = useState(null);
  const [atenciones, setAtenciones] = useState([]);
  const [prevenciones, setPrevenciones] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const stored = getStoredUser();
        const pacienteId = stored?.id || 3; // Fallback seguro a Camila Soto para pruebas directas

        const [u, seg, at, prev, rec, ev] = await Promise.all([
          api.getUsuario(pacienteId),
          api.getSeguimientoPaciente(pacienteId),
          api.getAtencionesPaciente(pacienteId),
          api.getPrevencionesActivas(),
          api.getRecordatoriosPaciente(pacienteId),
          api.getEvaluacionesPaciente(pacienteId),
        ]);

        setUsuario(u);
        setSeguimiento(seg);
        setAtenciones(at || []);
        setPrevenciones((prev || []).slice(0, 3));
        setRecordatorios(rec || []);
        setEvaluaciones(ev || []);
      } catch (err) {
        console.error('Error cargando dashboard de paciente:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const primerNombre = (usuario?.nombreCompleto || 'Paciente').split(' ')[0];
  const nivelActual =
    seguimiento?.nivel_semaforo ||
    evaluaciones[0]?.nivel_prioridad ||
    'INFORMACION_INSUFICIENTE';
  const metaPrioridad = PRIORIDAD_META[nivelActual] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;

  const getStatusBadge = (estado) => {
    if (estado === 'En proceso') return 'bg-blue-100 text-blue-700';
    if (estado === 'Completado') return 'bg-green-100 text-green-700';
    return 'bg-slate-200 text-slate-600';
  };

  const formatearFecha = (iso) => {
    if (!iso) return 'Sin fecha';
    return new Date(iso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-100 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-500 text-sm font-medium font-['Inter']">Cargando tu resumen clínico...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Hola, {primerNombre}</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Resumen de tu prevención y seguimiento de salud renal y urinaria.
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">
              {recordatorios.length} recordatorios activos
            </span>
          </button>
          <NotificationsMenu isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      </div>

      {/* Alerta Metabólica Paralela (si aplica) */}
      {seguimiento?.alerta_metabolica && seguimiento.alerta_metabolica !== 'NINGUNA' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-amber-900 text-xs font-bold uppercase tracking-wide">
              Alerta metabólica paralela (Glucosa)
            </span>
            <p className="text-amber-800 text-sm font-normal">{seguimiento.mensaje_metabolico}</p>
          </div>
          <a
            href="#paciente/tratamiento-activo"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0"
          >
            Ir a mi seguimiento
          </a>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna Izquierda */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Mis Atenciones */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Mis atenciones</h2>
              <a href="#paciente/atenciones" className="text-teal-700 text-xs font-semibold font-['Inter'] hover:underline">
                Ver todas
              </a>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {atenciones.length > 0 ? (
                atenciones.slice(0, 3).map((item) => (
                  <div key={item.id} className="px-4 py-3.5 bg-slate-50 rounded-xl flex justify-between items-center gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 text-sm font-semibold font-['Inter']">{item.titulo}</span>
                      <span className="text-slate-500 text-xs font-normal font-['Inter']">
                        {item.profesional?.nombre_completo || 'Equipo médico'} · {formatearFecha(item.fecha_hora)} · {item.modalidad}
                      </span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full shrink-0 ${getStatusBadge(item.estado)}`}>
                      <span className="text-xs font-semibold font-['Inter']">{item.estado}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs">Aún no tienes atenciones registradas.</p>
              )}
            </div>
          </section>

          {/* Recomendaciones para prevenir pielonefritis */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Prevención y cuidados urinarios</h2>
                <div className="px-2.5 py-1 bg-teal-100 rounded-full">
                  <span className="text-teal-800 text-xs font-semibold font-['Inter']">Validado</span>
                </div>
              </div>
              <a href="#paciente/prevencion" className="text-teal-700 text-xs font-semibold hover:underline">
                Ver guía completa
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {prevenciones.map((rec) => (
                <div key={rec.id} className="p-4 bg-teal-50 rounded-xl flex flex-col gap-1.5 border border-teal-100">
                  <span className="text-[10px] font-bold uppercase text-teal-700">{rec.categoria}</span>
                  <h3 className="text-teal-900 text-sm font-semibold font-['Inter']">{rec.titulo}</h3>
                  <p className="text-slate-600 text-xs font-normal font-['Inter'] line-clamp-3">{rec.descripcion}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Resumen Hidratación (con resguardo de restricción hídrica) */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">Registro de hidratación</h2>
              {usuario?.restriccionHidrica ? (
                <p className="text-red-700 text-xs font-semibold">
                  Tienes restricción hídrica registrada: {usuario.metaHidricaNota || 'Sigue el límite máximo de tu equipo tratante.'}
                </p>
              ) : (
                <p className="text-slate-600 text-xs">
                  Último registro: <strong>{formatearHidratacion(seguimiento?.ml_hidratacion)}</strong>.{' '}
                  {usuario?.metaHidricaNota || '1 vaso de referencia = 250 mL.'}
                </p>
              )}
            </div>
            <a
              href="#paciente/tratamiento-activo"
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shrink-0"
            >
              Registrar chequeo hoy
            </a>
          </section>
        </div>

        {/* Columna Derecha */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Semáforo Clínico Actual */}
          <section className={`p-6 bg-white rounded-2xl border-2 ${metaPrioridad.border} flex flex-col gap-3`}>
            <span className="text-slate-500 text-xs font-medium font-['Inter']">Estado de tu semáforo de seguimiento</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${metaPrioridad.badge}`}>
                {metaPrioridad.label}
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              {seguimiento?.mensaje_protocolo ||
                evaluaciones[0]?.recomendacion ||
                'Completa tu evaluación inicial o chequeo diario para activar el seguimiento.'}
            </p>
            {(seguimiento?.triggers_activos?.length > 0 || evaluaciones[0]?.motivos_prioridad?.length > 0) && (
              <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
                <span className="text-slate-500 text-[10px] font-bold uppercase">Criterios registrados</span>
                <ul className="flex flex-col gap-1">
                  {(seguimiento?.triggers_activos || evaluaciones[0]?.motivos_prioridad || []).map((t, i) => (
                    <li key={i} className="text-slate-700 text-xs">• {t}</li>
                  ))}
                </ul>
              </div>
            )}
            <a
              href="#paciente/tratamiento-activo"
              className="w-full mt-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-[10px] text-center"
            >
              Ir a tratamiento en curso
            </a>
          </section>

          {/* Evaluación Inicial / Antecedentes */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Evaluación y antecedentes</h3>
            <p className="text-slate-500 text-xs font-normal font-['Inter']">
              {evaluaciones.length > 0
                ? `Última evaluación registrada el ${formatearFecha(evaluaciones[0].fecha_evaluacion)}.`
                : 'Registra tus antecedentes médicos y síntomas para orientar tu seguimiento.'}
            </p>
            <a
              href="#paciente/formulario"
              className="w-full px-4 py-3 mt-1 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-center text-sm font-semibold font-['Inter']"
            >
              {evaluaciones.length > 0 ? 'Actualizar evaluación' : 'Completar formulario'}
            </a>
          </section>

          {/* Recordatorios */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-900 text-base font-bold font-['Inter']">Recordatorios</h3>
              <a href="#paciente/recordatorios" className="text-teal-700 text-xs font-semibold hover:underline">
                Ver todos
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {recordatorios.length > 0 ? (
                recordatorios.slice(0, 4).map((rec) => (
                  <div key={rec.id} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 mt-1.5 bg-teal-700 rounded-sm shrink-0" />
                    <div className="flex flex-col gap-px">
                      <span className="text-slate-900 text-xs font-semibold font-['Inter']">{rec.titulo}</span>
                      <span className="text-slate-500 text-xs font-normal font-['Inter']">
                        {rec.frecuencia} {rec.fecha_programada ? `· ${rec.fecha_programada}` : ''}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs">No tienes recordatorios pendientes.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}