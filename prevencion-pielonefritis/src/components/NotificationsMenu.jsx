import React from 'react';

export default function NotificationsMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay invisible para cerrar al hacer clic afuera */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      {/* Menú Dropdown */}
      <div className="absolute top-14 right-0 z-50 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Header Notificaciones */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex flex-col">
          <span className="text-slate-900 text-base font-bold font-['Inter']">Notificaciones</span>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">Tienes 3 notificaciones pendientes</span>
        </div>

        {/* Lista de Notificaciones */}
        <div className="flex flex-col max-h-[350px] overflow-y-auto">
          
          <button className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 border-b border-slate-50 text-left">
            <div className="w-2 h-2 bg-red-700 rounded-full mt-1 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 text-xs font-semibold font-['Inter']">Revisa tus síntomas</span>
              <span className="text-slate-600 text-xs font-normal font-['Inter']">Registra cómo te sientes hoy para mantener tu seguimiento.</span>
              <span className="text-slate-500 text-[10px] font-normal font-['Inter'] mt-0.5">Hace 10 min</span>
            </div>
          </button>

          <button className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 border-b border-slate-50 text-left">
            <div className="w-2 h-2 bg-teal-700 rounded-full mt-1 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 text-xs font-semibold font-['Inter']">Próxima consulta</span>
              <span className="text-slate-600 text-xs font-normal font-['Inter']">Tienes una atención programada próximamente.</span>
              <span className="text-slate-500 text-[10px] font-normal font-['Inter'] mt-0.5">Hoy · 09:30</span>
            </div>
          </button>

          <button className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 text-left">
            <div className="w-2 h-2 bg-teal-700 rounded-full mt-1 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 text-xs font-semibold font-['Inter']">Recordatorio</span>
              <span className="text-slate-600 text-xs font-normal font-['Inter']">No olvides registrar tu estado de hoy.</span>
              <span className="text-slate-500 text-[10px] font-normal font-['Inter'] mt-0.5">Ayer · 18:20</span>
            </div>
          </button>

        </div>
      </div>
    </>
  );
}