import React, { useState } from 'react';

export default function ProPrevenciones() {
  const [activeTab, setActiveTab] = useState('Todas');

  // Datos mockeados de la base de conocimientos preventivos
  const prevenciones = [
    {
      id: 1,
      title: 'Hidratación constante',
      category: 'Hábitos diarios',
      description: 'Bebe agua durante todo el día (aprox. 1,5 a 2 litros, salvo indicación médica) para ayudar a eliminar bacterias del tracto urinario.',
      author: 'Dra. Valentina Rojas',
      date: '10 Sep 2026',
      status: 'Activa',
      statusColor: 'green'
    },
    {
      id: 2,
      title: 'No retener la orina',
      category: 'Hábitos diarios',
      description: 'Ve al baño cuando sientas ganas y vacía la vejiga por completo cada vez para evitar la proliferación bacteriana.',
      author: 'Dr. Freddy Turbina',
      date: '12 Sep 2026',
      status: 'Activa',
      statusColor: 'green'
    },
    {
      id: 3,
      title: 'Higiene post-coital',
      category: 'Salud sexual',
      description: 'Orinar inmediatamente después de las relaciones sexuales ayuda a expulsar bacterias que puedan haber entrado a la uretra.',
      author: 'Matrona Silvia Pino',
      date: '15 Sep 2026',
      status: 'En revisión',
      statusColor: 'amber'
    },
    {
      id: 4,
      title: 'Fiebre o escalofríos',
      category: 'Señales de alarma',
      description: 'Temperatura sobre 38 °C o escalofríos junto con síntomas urinarios requiere consulta de urgencia el mismo día.',
      author: 'Dra. Valentina Rojas',
      date: '20 Sep 2026',
      status: 'Activa',
      statusColor: 'green'
    },
    {
      id: 5,
      title: 'Uso profiláctico de arándanos',
      category: 'Nutrición / Suplementos',
      description: 'El uso de cápsulas de cranberry puede reducir la adherencia de E. coli, pero requiere validación de dosis según historial gástrico.',
      author: 'Nut. Camila Ibáñez',
      date: '02 Oct 2026',
      status: 'Borrador',
      statusColor: 'slate'
    }
  ];

  // Helper de colores para los badges de estado
  const getBadgeStyle = (color) => {
    switch(color) {
      case 'green': return 'bg-green-100 text-green-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'red': return 'bg-red-100 text-red-700';
      case 'slate': default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Lista de prevenciones</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Gestiona la base de conocimientos y pautas preventivas que ven tus pacientes.
          </p>
        </div>
        <button className="px-4 py-3 bg-red-700 hover:bg-red-800 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shadow-sm shrink-0 flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Nueva indicación
        </button>
      </div>

      {/* Barra de Filtros y Buscador */}
      <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        
        {/* Tabs de Filtro */}
        <div className="flex gap-2 p-1 bg-zinc-200/50 rounded-xl">
          {['Todas', 'Activas', 'En revisión', 'Borradores'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold font-['Inter'] rounded-lg transition-colors ${
                activeTab === tab 
                  ? 'bg-white text-red-700 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="w-full lg:w-96 px-4 py-2.5 bg-white rounded-xl border border-slate-300 flex items-center shadow-sm">
          <input 
            type="text" 
            placeholder="Buscar indicación o categoría..." 
            className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 text-sm font-normal font-['Inter'] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid de Tarjetas de Prevención */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {prevenciones.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            
            {/* Cabecera de la Tarjeta */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-[10px] font-bold font-['Inter'] uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-slate-900 text-base font-semibold font-['Inter'] leading-tight">
                  {item.title}
                </h3>
              </div>
              <div className={`px-2.5 py-1 rounded-full flex justify-center items-center shrink-0 ${getBadgeStyle(item.statusColor)}`}>
                <span className="text-[10px] font-semibold font-['Inter'] uppercase">{item.status}</span>
              </div>
            </div>

            {/* Cuerpo (Descripción) */}
            <div className="px-5 py-4 flex-1">
              <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Footer de la Tarjeta (Autor y Acciones) */}
            <div className="px-5 py-4 border-t border-slate-100 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex justify-center items-center shrink-0 border border-slate-200">
                    <span className="text-slate-500 text-[10px] font-semibold">{item.author.substring(0,2)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-700 text-xs font-medium font-['Inter'] leading-none">{item.author}</span>
                    <span className="text-slate-400 text-[10px] font-normal font-['Inter'] mt-0.5">{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción colaborativa */}
              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold font-['Inter'] transition-colors">
                  Editar
                </button>
                {item.status !== 'En revisión' && (
                  <button className="flex-1 py-2 bg-white hover:bg-red-50 border border-red-700 text-red-700 rounded-lg text-xs font-semibold font-['Inter'] transition-colors">
                    Pedir revisión
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}