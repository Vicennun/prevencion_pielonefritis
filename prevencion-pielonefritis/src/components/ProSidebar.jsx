import React from 'react';

export default function ProSidebar({ activeTab = 'inicio' }) {
  const menuItems = [
    { id: 'inicio', label: 'Inicio', href: '#profesional' },
    { id: 'historial', label: 'Historial de atenciones', href: '#profesional/historial' },
    { id: 'pacientes', label: 'Lista de pacientes', href: '#profesional/pacientes' },
    
    // Nuevo enlace directo al Módulo de Seguimiento / Semáforo
    { id: 'seguimiento-activo', label: 'Monitor clínico', href: '#profesional/seguimiento-activo' },
    
    { id: 'mensajes', label: 'Mensajes', href: '#profesional/mensajes' },
    { id: 'prevenciones', label: 'Lista de prevenciones', href: '#profesional/prevenciones' },
    { id: 'recordatorios', label: 'Recordatorios', href: '#profesional/recordatorios' },
  ];

  return (
    <aside className="w-full lg:w-64 min-h-screen px-4 py-6 bg-zinc-100 flex flex-col justify-start items-start gap-1.5 border-r border-zinc-300 shrink-0">
      
      {/* Branding */}
      <div className="px-2 py-1 flex justify-start items-center gap-2.5 mb-2">
        <div className="w-9 h-9 bg-red-700 rounded-[10px] flex justify-center items-center">
          <span className="text-white text-lg font-bold font-['Inter']">N</span>
        </div>
        <span className="text-red-700 text-base font-bold font-['Inter']">
          CERO - NEFRITIS
        </span>
      </div>

      <div className="px-3 py-4 w-full">
        <span className="text-slate-500 text-xs font-semibold font-['Inter'] tracking-wide uppercase">
          Profesional
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 w-full flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`w-full px-3 py-2.5 rounded-[10px] flex justify-start items-center gap-2.5 transition-colors ${
                isActive ? 'bg-red-50' : 'hover:bg-zinc-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-[5px] ${isActive ? 'bg-red-700' : 'bg-red-700/30'}`} />
              <span className={`text-sm font-['Inter'] ${isActive ? 'text-red-700 font-semibold' : 'text-slate-600 font-medium'}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Perfil del Profesional */}
      <div className="w-full px-2 py-3 flex justify-start items-center gap-2.5 mt-auto hover:bg-zinc-200 rounded-xl cursor-pointer transition-colors">
        <div className="w-9 h-9 bg-red-100 rounded-2xl flex justify-center items-center shrink-0">
          <span className="text-red-700 text-xs font-semibold font-['Inter']">FT</span>
        </div>
        <div className="flex flex-col justify-start items-start gap-0.5 overflow-hidden">
          <span className="text-red-700 text-xs font-semibold font-['Inter'] truncate w-full">Freddy Turbina</span>
          <span className="text-slate-500 text-xs font-normal font-['Inter'] truncate w-full">Médico Cirujano</span>
        </div>
      </div>
    </aside>
  );
}