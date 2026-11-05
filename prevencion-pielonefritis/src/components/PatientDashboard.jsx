import React from 'react';

export default function PatientDashboard() {
  const atenciones = [
    { title: 'Control de presión arterial', subtitle: 'Dra. Valentina Rojas · 12 oct 2026', status: 'En proceso', color: 'blue' },
    { title: 'Examen de laboratorio', subtitle: 'Laboratorio central · 28 sep 2026', status: 'Completado', color: 'green' },
    { title: 'Consulta de seguimiento', subtitle: 'Dr. Freddy Turbina · 15 sep 2026', status: 'Cancelado', color: 'slate' },
  ];

  const recomendaciones = [
    { title: 'Controla tu presión', desc: 'Mide tu presión dos veces por semana y anótala.' },
    { title: 'Alimentación con menos sal', desc: 'Prefiere comidas caseras y evita ultraprocesados.' },
    { title: 'Muévete cada día', desc: 'Camina al menos 30 minutos, a tu ritmo.' },
  ];

  const recordatorios = [
    { title: 'Tomar medicación', time: 'Hoy · 08:00' },
    { title: 'Control de presión', time: 'Jue 8 oct' },
    { title: 'Subir examen de laboratorio', time: 'Vie 9 oct' },
  ];

  // Helper para colores de estado
  const getBadgeColors = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'green': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Hola, Camila</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">Este es el resumen de tu seguimiento de salud</p>
        </div>
        <div className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
          <span className="text-slate-900 text-xs font-medium font-['Inter']">3 notificaciones</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Mis Atenciones */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Mis atenciones</h2>
              <button className="text-teal-700 text-xs font-semibold font-['Inter'] hover:underline">Ver todas</button>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {atenciones.map((item, idx) => (
                <div key={idx} className="px-4 py-3.5 bg-slate-50 rounded-xl flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-900 text-sm font-semibold font-['Inter']">{item.title}</span>
                    <span className="text-slate-500 text-xs font-normal font-['Inter']">{item.subtitle}</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full flex justify-center items-center shrink-0 ${getBadgeColors(item.color)}`}>
                    <span className="text-xs font-semibold font-['Inter']">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recomendaciones */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Recomendaciones para prevenir</h2>
              <div className="px-2.5 py-1 bg-teal-100 rounded-full">
                <span className="text-teal-800 text-xs font-semibold font-['Inter']">Gratis</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recomendaciones.map((rec, idx) => (
                <div key={idx} className="p-4 bg-teal-50 rounded-xl flex flex-col gap-1.5">
                  <h3 className="text-teal-800 text-sm font-semibold font-['Inter']">{rec.title}</h3>
                  <p className="text-slate-600 text-xs font-normal font-['Inter']">{rec.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Widgets) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Nivel de Riesgo */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <span className="text-slate-500 text-xs font-medium font-['Inter']">Tu nivel de riesgo</span>
            <div className="flex items-center gap-2.5">
              <span className="text-slate-900 text-2xl font-bold font-['Inter']">Moderado</span>
              <div className="px-2.5 py-1 bg-amber-100 rounded-full">
                <span className="text-amber-700 text-xs font-semibold font-['Inter']">Nivel 2 de 3</span>
              </div>
            </div>
            <div className="flex gap-1.5 w-full">
              <div className="flex-1 h-2 bg-amber-500 rounded-sm" />
              <div className="flex-1 h-2 bg-amber-500 rounded-sm" />
              <div className="flex-1 h-2 bg-slate-200 rounded-sm" />
            </div>
            <h4 className="text-slate-900 text-xs font-semibold font-['Inter'] mt-2">Indicaciones para tu sector</h4>
            <ul className="flex flex-col gap-1">
              <li className="text-slate-600 text-xs font-normal font-['Inter']">• Mide tu presión 2 veces por semana</li>
              <li className="text-slate-600 text-xs font-normal font-['Inter']">• Reduce el consumo de sal</li>
              <li className="text-slate-600 text-xs font-normal font-['Inter']">• Camina 30 minutos al día</li>
            </ul>
          </section>

          {/* Formulario Preliminar */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Formulario preliminar</h3>
            <p className="text-slate-500 text-xs font-normal font-['Inter']">Completa tu información inicial para personalizar tu atención.</p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200 rounded-sm mt-1">
              <div className="w-[60%] h-2 bg-teal-700 rounded-sm" />
            </div>
            <span className="text-slate-500 text-xs font-medium font-['Inter']">60% completado</span>
            
            <button className="w-full px-4 py-3 mt-2 bg-teal-700 hover:bg-teal-800 transition-colors rounded-[10px] flex justify-center items-center">
              <span className="text-white text-sm font-semibold font-['Inter']">Continuar formulario</span>
            </button>
          </section>

          {/* Recordatorios */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Recordatorios</h3>
            <div className="flex flex-col gap-3">
              {recordatorios.map((rec, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-teal-700 rounded-sm shrink-0" />
                  <div className="flex flex-col gap-px">
                    <span className="text-slate-900 text-xs font-semibold font-['Inter']">{rec.title}</span>
                    <span className="text-slate-500 text-xs font-normal font-['Inter']">{rec.time}</span>
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