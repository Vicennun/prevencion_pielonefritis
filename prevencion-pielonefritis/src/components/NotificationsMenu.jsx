import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';

export default function NotificationsMenu({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const cargar = async () => {
      setLoading(true);
      try {
        const user = getStoredUser();
        if (user?.rol === 'PROFESIONAL') {
          const all = await api.getTodosRecordatorios();
          setItems((all || []).slice(0, 6));
        } else {
          const pacienteId = user?.id || 3;
          const recs = await api.getRecordatoriosPaciente(pacienteId);
          setItems((recs || []).slice(0, 6));
        }
      } catch (err) {
        console.error('Error cargando notificaciones:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [isOpen]);

  if (!isOpen) return null;

  const user = getStoredUser();
  const isPro = user?.rol === 'PROFESIONAL';

  const handleNavigate = (item) => {
    onClose();
    if (isPro) {
      window.location.hash = item.tipo === 'examen' ? '#profesional/revision-examen' : '#profesional/recordatorios';
    } else {
      window.location.hash = item.frecuencia === 'Alarma' ? '#paciente/tratamiento-activo' : '#paciente/recordatorios';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute top-14 right-0 z-50 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 flex flex-col">
          <span className="text-slate-900 text-base font-bold font-['Inter']">Notificaciones</span>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">
            {loading ? 'Actualizando...' : `Tienes ${items.length} avisos activos`}
          </span>
        </div>

        <div className="flex flex-col max-h-[350px] overflow-y-auto">
          {!loading && items.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-500">
              No tienes notificaciones pendientes.
            </div>
          )}

          {items.map((item) => {
            const isUrgent = item.prioridad === 'Alta' || item.frecuencia === 'Alarma' || item.tipo === 'alerta';
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item)}
                className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 border-b border-slate-50 text-left cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isUrgent ? 'bg-red-700' : 'bg-teal-700'}`} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-900 text-xs font-semibold font-['Inter']">{item.titulo}</span>
                  <span className="text-slate-600 text-xs font-normal font-['Inter'] line-clamp-2">{item.descripcion}</span>
                  <span className="text-slate-400 text-[10px] font-normal font-['Inter'] mt-0.5">
                    {item.frecuencia}{item.fecha_programada ? ` · ${item.fecha_programada}` : ''}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}