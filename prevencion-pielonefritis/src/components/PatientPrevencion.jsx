import React, { useEffect, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { api, getStoredUser } from '../services/api';

const FAQ_VALIDADAS = [
  {
    q: '¿Cuál es la diferencia entre cistitis y pielonefritis?',
    a: 'La cistitis afecta la vejiga (ardor, frecuencia o molestia pélvica). La pielonefritis es una infección del riñón que suele presentarse con fiebre, escalofríos, dolor en el costado/espalda baja y náuseas o vómitos.',
  },
  {
    q: '¿Cuándo debería comenzar a notar mejoría?',
    a: 'Con un tratamiento eficaz suele comenzar a mejorar en 48 a 72 horas. Si empeoras o no empiezas a mejorar en 48 horas, solicita reevaluación; no esperes si aparecen señales de alarma.',
  },
  {
    q: '¿Necesito urocultivo y debo repetirlo si ya estoy sin síntomas?',
    a: 'Ante sospecha de pielonefritis se recomienda urocultivo con antibiograma en todos los casos. Repetirlo cuando ya estás asintomático generalmente no es de rutina, salvo indicación específica (por ejemplo, embarazo o complicación).',
  },
  {
    q: '¿Qué hago si vomito el antibiótico o no puedo tomar líquidos?',
    a: 'Contacta a tu equipo de salud. Si los vómitos son persistentes y no toleras líquidos ni tus medicamentos, acude a valoración urgente.',
  },
];

export default function PatientPrevencion() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [guias, setGuias] = useState([]);
  const [usuario, setUsuario] = useState(getStoredUser());
  const [proximaCita, setProximaCita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const pacienteId = getStoredUser()?.id || 3;
        const [activas, u, atenciones] = await Promise.all([
          api.getPrevencionesActivas(),
          api.getUsuario(pacienteId),
          api.getAtencionesPaciente(pacienteId),
        ]);
        setGuias(activas || []);
        setUsuario(u);
        const enProceso = (atenciones || []).find((a) => a.estado === 'En proceso');
        setProximaCita(enProceso || null);
      } catch (err) {
        console.error('Error cargando prevención:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const guiasAlarma = guias.filter((g) => g.categoria.toLowerCase().includes('alarma'));
  const guiasHabitos = guias.filter((g) => !g.categoria.toLowerCase().includes('alarma'));

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
            Prevención y cuidados en pielonefritis
          </h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            La pielonefritis es una infección del riñón, generalmente por bacterias que ascienden desde la vejiga. Con buenos hábitos y consulta oportuna puedes reducir complicaciones.
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Columna Principal */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Pautas dinámicas desde Supabase */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Guías preventivas validadas por tu equipo médico</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Contenido actualizado directamente por los profesionales de la plataforma.
              </p>
            </div>

            {usuario?.restriccionHidrica && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-semibold">
                Nota personalizada: Tienes restricción hídrica activa. {usuario.metaHidricaNota || 'Sigue siempre el límite indicado por tu equipo tratante.'}
              </div>
            )}

            {/* Bloque Hábitos y Cuidados */}
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex flex-col gap-3.5">
              <h3 className="text-teal-800 text-sm font-bold font-['Inter']">Hábitos y tratamiento seguro</h3>
              {loading ? (
                <p className="text-xs text-slate-500">Cargando pautas...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guiasHabitos.map((g) => (
                    <div key={g.id} className="p-3.5 bg-white rounded-[10px] border border-slate-200 flex flex-col gap-1 shadow-sm">
                      <span className="text-[10px] font-bold uppercase text-teal-700">{g.categoria}</span>
                      <h4 className="text-slate-900 text-xs font-semibold">{g.titulo}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{g.descripcion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bloque Señales de Alarma (Urgencias vs Mismo Día) */}
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex flex-col gap-3.5">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-red-800 text-sm font-bold font-['Inter']">Señales de alarma: cuándo consultar</h3>
                <p className="text-slate-600 text-xs">
                  No esperes a que aparezcan todos los signos. Distingue cuándo acudir de inmediato a urgencias:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-[10px] border-2 border-red-500 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-red-700">Urgencias inmediatas</span>
                  <h4 className="text-slate-900 text-xs font-semibold">Acude a urgencias o llama a emergencias</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Confusión o somnolencia nueva, desmayo, dificultad respiratoria, hipotensión, sangre en orina con coágulos/retención o deterioro rápido.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-[10px] border border-red-200 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Valoración el mismo día</span>
                  <h4 className="text-slate-900 text-xs font-semibold">Consulta presencial hoy</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Fiebre ≥ 38 °C, escalofríos intensos con temblor, dolor nuevo o creciente en costado/espalda baja, vómitos persistentes, embarazo con síntomas o sin mejoría en 48–72 h.
                  </p>
                </div>

                {guiasAlarma.map((g) => (
                  <div key={g.id} className="md:col-span-2 p-3.5 bg-white rounded-[10px] border border-red-200 flex flex-col gap-1">
                    <h4 className="text-red-800 text-xs font-semibold">{g.titulo}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{g.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preguntas Frecuentes Validadas */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
            <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Preguntas frecuentes</h2>
            <div className="flex flex-col gap-3">
              {FAQ_VALIDADAS.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                  <h3 className="text-slate-900 text-sm font-semibold">{item.q}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Secundaria (Datos reales del paciente) */}
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
                <span className="text-slate-500 text-xs font-semibold block">Edad</span>
                <span className="text-slate-900 text-sm font-semibold">{usuario?.edad ? `${usuario.edad} años` : 'No registrada'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-semibold block">Contacto</span>
                <span className="text-slate-900 text-sm font-semibold">{usuario?.telefono || usuario?.email || 'No registrado'}</span>
              </div>
            </div>

            <a
              href="#paciente/atenciones"
              className="w-full mt-2 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold text-center"
            >
              Ver mis atenciones
            </a>
          </section>

          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Próxima consulta</h3>
            {proximaCita ? (
              <div className="flex flex-col gap-1">
                <span className="text-slate-900 text-sm font-semibold">{proximaCita.titulo}</span>
                <span className="text-slate-500 text-xs">
                  {proximaCita.profesional?.nombre_completo || 'Equipo médico'} · {proximaCita.modalidad}
                </span>
                <span className="text-teal-700 text-xs font-semibold">
                  {new Date(proximaCita.fecha_hora).toLocaleString('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 text-sm font-semibold">Sin consulta activa</span>
                <span className="text-slate-500 text-xs">Puedes solicitar un control desde Mis atenciones.</span>
              </div>
            )}
            <a
              href="#paciente/atenciones"
              className="w-full mt-1 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold text-center"
            >
              Ver detalles
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}