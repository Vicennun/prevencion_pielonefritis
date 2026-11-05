import React from 'react';

export default function ProDashboard() {
  const atenciones = [
    { title: 'Control de perfil lipídico', patient: 'Rodrigo Rojas', date: '2 oct 2026', status: 'En proceso', color: 'blue' },
    { title: 'Examen de laboratorio', patient: 'Laboratorio central', date: '2 oct 2026', status: 'Completado', color: 'green' },
    { title: 'Consulta de seguimiento', patient: 'Camila Ñuñez', date: '15 sep 2026', status: 'Cancelado', color: 'slate' },
  ];

  const pacientes = [
    { name: 'Camila Ñuñez Suazo', update: 'Consulta seguimiento', status: 'cancelada' },
    { name: 'Rodrigo Rojas Torres', update: 'Control Perfil lipídico.', status: 'Esperando resultados' },
    { name: 'Ernesto Salamanca', update: 'Control glucemia', status: 'Reagendado' },
  ];

  const getBadgeColors = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'green': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Saludos, Freddy</h1>
          <p className="text-red-700/70 text-sm font-normal font-['Inter']">Lobby gestión - profesional</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-red-700 text-3xl font-bold font-['Inter'] pr-2">Mon.</span>
            <span className="text-red-700 text-2xl font-bold font-['Inter']">05/10/2026</span>
          </div>
          <button className="px-3.5 py-2.5 bg-zinc-100 rounded-full border border-zinc-300 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-red-700 text-xs font-medium font-['Inter']">3 notificaciones</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Columna Izquierda (Principal) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Mis Atenciones */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-red-700 text-lg font-bold font-['Inter']">Mis atenciones</h2>
              <button className="text-stone-500 text-xs font-semibold font-['Inter'] hover:underline">Ver todas</button>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              {atenciones.map((item, idx) => (
                <div key={idx} className="px-4 py-3.5 bg-white rounded-xl border border-zinc-200 flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-red-700 text-sm font-semibold font-['Inter']">{item.title}</span>
                    <span className="text-red-700/70 text-xs font-normal font-['Inter']">{item.patient} · {item.date}</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full flex justify-center items-center shrink-0 ${getBadgeColors(item.color)}`}>
                    <span className="text-xs font-semibold font-['Inter']">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pacientes en Seguimiento */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 w-full">
              <h2 className="text-red-700 text-lg font-bold font-['Inter']">Panel pacientes en seguimiento</h2>
              <div className="px-2.5 py-1 bg-red-100 rounded-full">
                <span className="text-red-700 text-xs font-semibold font-['Inter']">2+ Pendientes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pacientes.map((paciente, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-zinc-200 flex flex-col gap-1.5 shadow-sm">
                  <h3 className="text-red-700 text-sm font-semibold font-['Inter']">{paciente.name}</h3>
                  <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-relaxed">
                    Ult. actualización: {paciente.update}<br/>
                    Estado: {paciente.status}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Columna Derecha (Secundaria) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Mensajes */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-3">
            <span className="text-red-700/70 text-xs font-medium font-['Inter']">Tus mensajes</span>
            <div className="flex justify-between items-center">
              <h2 className="text-red-700 text-2xl font-bold font-['Inter']">Mensajes</h2>
              <div className="px-2.5 py-1 bg-amber-100 rounded-full">
                <span className="text-amber-700 text-xs font-semibold font-['Inter']">3 de 5</span>
              </div>
            </div>
            <div className="w-full h-2 bg-zinc-300 rounded-sm overflow-hidden mt-1">
              <div className="w-[60%] h-full bg-black rounded-sm" />
            </div>
            <h3 className="text-red-700 text-xs font-semibold font-['Inter'] mt-2">Lista asuntos últimos mensajes</h3>
            <ul className="flex flex-col gap-1">
              <li className="text-slate-600 text-xs font-normal font-['Inter'] truncate">• Dolor de cabeza al despertar - R.Rojas</li>
              <li className="text-slate-600 text-xs font-normal font-['Inter'] truncate">• Puedo comer frutas? - E.Salamanca</li>
              <li className="text-slate-600 text-xs font-normal font-['Inter'] truncate">• Doc. Quedé embarazada - Camila Ñuñez</li>
            </ul>
          </section>

          {/* Ingreso Nuevo Paciente */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-3">
            <h2 className="text-red-700 text-base font-bold font-['Inter']">Ingresar nuevo paciente</h2>
            <p className="text-red-700/70 text-xs font-normal font-['Inter']">Completar Ingreso</p>
            
            <div className="w-full h-2 bg-zinc-300 rounded-sm mt-1 overflow-hidden">
              <div className="w-[15%] h-full bg-red-700 rounded-sm" />
            </div>
            <span className="text-red-700/70 text-xs font-medium font-['Inter']">15% completado</span>
            
            <button className="w-full mt-2 px-4 py-3 bg-red-700 hover:bg-red-800 transition-colors rounded-[10px] flex justify-center items-center">
              <span className="text-white text-sm font-semibold font-['Inter']">Continuar ingreso</span>
            </button>
          </section>

          {/* Recordatorios */}
          <section className="p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4">
            <h2 className="text-red-700 text-base font-bold font-['Inter']">Recordatorios</h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-stone-500 rounded-sm shrink-0" />
                <div className="flex flex-col gap-px overflow-hidden">
                  <span className="text-red-700 text-xs font-semibold font-['Inter'] truncate">Resultados Seguimiento Camila</span>
                  <span className="text-red-700/70 text-xs font-normal font-['Inter']">Vie 9 oct.</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-stone-500 rounded-sm shrink-0" />
                <div className="flex flex-col gap-px overflow-hidden">
                  <span className="text-red-700 text-xs font-semibold font-['Inter'] truncate">Subir examen de laboratorio</span>
                  <span className="text-red-700/70 text-xs font-normal font-['Inter']">Vie 9 oct</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-stone-500 rounded-sm shrink-0" />
                <div className="flex flex-col gap-px overflow-hidden">
                  <span className="text-red-700 text-xs font-semibold font-['Inter'] truncate">Seguimiento Ernesto</span>
                  <span className="text-red-700/70 text-xs font-normal font-['Inter']">Lun 12 oct</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}