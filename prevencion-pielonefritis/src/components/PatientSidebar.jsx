import React from 'react';

export default function PatientSidebar({ activeTab = 'inicio' }) {
  // Agregamos la propiedad 'href' a cada item apuntando a sus rutas
  const menuItems = [
    { id: 'inicio', label: 'Inicio', href: '#paciente' },
    { id: 'atenciones', label: 'Mis atenciones', href: '#paciente/atenciones' },
    { id: 'mensajes', label: 'Mensajes', href: '#paciente/mensajes' },
    { id: 'formulario', label: 'Formulario preliminar', href: '#paciente/formulario' },
    { id: 'prevencion', label: 'Prevención', href: '#paciente/prevencion' },
    { id: 'recordatorios', label: 'Recordatorios', href: '#paciente/recordatorios' },
  ];

  return (
    <aside className="w-full lg:w-64 min-h-screen px-4 py-6 bg-white flex flex-col justify-start items-start gap-1.5 border-r border-slate-200 shrink-0">
      {/* Branding */}
      <div className="px-2 py-1 flex justify-start items-center gap-2.5 mb-2">
        <div className="w-9 h-9 bg-teal-700 rounded-[10px] flex justify-center items-center">
          <span className="text-white text-lg font-bold font-['Inter']">S</span>
        </div>
        <span className="text-slate-900 text-base font-bold font-['Inter']">
          Seguimiento Salud
        </span>
      </div>

      <div className="px-3 py-4 w-full">
        <span className="text-slate-500 text-xs font-semibold font-['Inter'] tracking-wide">
          PACIENTE
        </span>
      </div>

      {/* Navegación (Ahora con etiquetas <a>) */}
      <nav className="flex-1 w-full flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`w-full px-3 py-2.5 rounded-[10px] flex justify-start items-center gap-2.5 transition-colors ${
                isActive ? 'bg-teal-100' : 'hover:bg-slate-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-[5px] ${isActive ? 'bg-teal-700' : 'bg-slate-300'}`} />
              <span className={`text-sm font-['Inter'] ${isActive ? 'text-teal-800 font-semibold' : 'text-slate-600 font-medium'}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Perfil del Usuario */}
      <div className="w-full px-2 py-3 flex justify-start items-center gap-2.5 mt-auto hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
        <div className="w-9 h-9 bg-teal-100 rounded-2xl flex justify-center items-center">
          <span className="text-teal-800 text-xs font-semibold font-['Inter']">CS</span>
        </div>
        <div className="flex flex-col justify-start items-start gap-0.5">
          <span className="text-slate-900 text-xs font-semibold font-['Inter']">Camila Soto</span>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">Paciente</span>
        </div>
      </div>
    </aside>
  );
}