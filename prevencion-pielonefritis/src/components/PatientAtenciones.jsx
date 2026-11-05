import React, { useState } from 'react';

export default function PatientAtenciones() {
  // Estado para manejar qué filtro está activo (Todas, Próximas, Completadas)
  const [activeFilter, setActiveFilter] = useState('Todas');
  
  // Estado para la atención seleccionada (simulamos que por defecto está seleccionada la primera)
  const [selectedId, setSelectedId] = useState(1);

  // Datos mockeados de las atenciones (luego los traeremos de Supabase)
  const atenciones = [
    {
      id: 1,
      day: '18',
      month: 'JUN',
      title: 'Control de seguimiento',
      status: 'Próxima',
      statusColor: 'teal',
      professional: 'Dra. Valentina Rojas · Medicina general',
      timeLoc: '10:30 · Videoconsulta',
      details: {
        desc: 'Seguimiento de presión arterial y revisión de síntomas.',
        dateStr: 'Miércoles 18 de junio\n10:30 hrs',
        profName: 'Dra. Valentina Rojas',
        profSpec: 'Medicina general',
        modality: 'Videoconsulta',
        indications: 'Ten a mano tus últimas mediciones y la lista de medicamentos que estás tomando.'
      }
    },
    {
      id: 2,
      day: '02',
      month: 'JUL',
      title: 'Control preventivo',
      status: 'Próxima',
      statusColor: 'teal',
      professional: 'Dr. Tomás Leiva · Medicina familiar',
      timeLoc: '16:00 · Centro Médico Providencia',
      details: {
        desc: 'Chequeo general preventivo mensual.',
        dateStr: 'Lunes 02 de julio\n16:00 hrs',
        profName: 'Dr. Tomás Leiva',
        profSpec: 'Medicina familiar',
        modality: 'Presencial',
        indications: 'Llegar 15 minutos antes con cédula de identidad.'
      }
    },
    {
      id: 3,
      day: '28',
      month: 'MAY',
      title: 'Evaluación inicial',
      status: 'Completada',
      statusColor: 'slate',
      professional: 'Dra. Valentina Rojas · Medicina general',
      timeLoc: '09:15 · Videoconsulta',
      details: {
        desc: 'Primera evaluación para apertura de ficha clínica.',
        dateStr: 'Martes 28 de mayo\n09:15 hrs',
        profName: 'Dra. Valentina Rojas',
        profSpec: 'Medicina general',
        modality: 'Videoconsulta',
        indications: 'Ninguna indicación previa.'
      }
    },
    {
      id: 4,
      day: '08',
      month: 'MAY',
      title: 'Orientación nutricional',
      status: 'Cancelada',
      statusColor: 'rose',
      professional: 'Camila Ibáñez · Nutrición',
      timeLoc: '12:00 · Centro Médico Providencia',
      details: {
        desc: 'Planificación de pauta alimenticia ajustada a requerimientos.',
        dateStr: 'Miércoles 08 de mayo\n12:00 hrs',
        profName: 'Camila Ibáñez',
        profSpec: 'Nutrición',
        modality: 'Presencial',
        indications: 'Paciente canceló la cita con 24 hrs de anticipación.'
      }
    }
  ];

  const selectedAtencion = atenciones.find(a => a.id === selectedId);

  // Helper para pintar badges según estado
  const getBadgeStyle = (color) => {
    switch (color) {
      case 'teal': return 'bg-teal-100 text-teal-800';
      case 'rose': return 'bg-rose-100 text-rose-800';
      case 'slate': default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 text-xs font-semibold font-['Inter'] tracking-wide">SALUD Y SEGUIMIENTO</span>
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Mis atenciones</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Revisa tus próximas consultas y el historial de tus atenciones.
          </p>
        </div>
        <button className="px-4 py-3 bg-teal-700 hover:bg-teal-800 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0">
          Solicitar una atención
        </button>
      </div>

      {/* Widgets Resumen (Tarjetas superiores) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-teal-100 rounded-xl relative flex justify-center items-center">
            <div className="w-1.5 h-6 absolute left-0 rounded-full border-l-4 border-teal-700" />
            <span className="text-slate-900 text-xl font-bold font-['Inter']">2</span>
          </div>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">Próximas atenciones</span>
        </div>
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-slate-100 rounded-xl relative flex justify-center items-center">
            <div className="w-1.5 h-6 absolute left-0 rounded-full border-l-4 border-slate-500" />
            <span className="text-slate-900 text-xl font-bold font-['Inter']">1</span>
          </div>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">Atención completada</span>
        </div>
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-slate-100 rounded-xl relative flex flex-col justify-center items-center">
            <div className="w-1.5 h-6 absolute left-0 rounded-full border-l-4 border-slate-500" />
            <span className="text-slate-900 text-sm font-bold font-['Inter'] leading-none">18</span>
            <span className="text-slate-500 text-[10px] font-semibold font-['Inter'] leading-tight uppercase">Jun</span>
          </div>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">Próximo control</span>
        </div>
      </div>

      {/* Main Content: Maestro (Lista) - Detalle */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
        
        {/* Panel Izquierdo: Lista de Atenciones */}
        <div className="w-full lg:w-1/2 xl:w-[45%] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
          
          {/* Header Lista & Filtros */}
          <div className="p-5 border-b border-slate-200 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">Atenciones</h2>
              <span className="text-slate-500 text-sm font-normal font-['Inter']">Selecciona una atención para ver sus detalles</span>
            </div>
            
            <div className="p-1 bg-slate-100 rounded-lg flex items-center">
              {['Todas', 'Próximas', 'Completadas'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium font-['Inter'] transition-colors ${
                    activeFilter === filter 
                      ? 'bg-white text-teal-800 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Lista Scrolleable */}
          <div className="flex flex-col p-2 gap-1 overflow-y-auto max-h-[500px] lg:max-h-none">
            {atenciones.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full p-3 rounded-xl border transition-colors flex items-center gap-4 text-left ${
                  selectedId === item.id 
                    ? 'bg-teal-50 border-teal-200' 
                    : 'bg-white border-transparent hover:border-slate-200'
                }`}
              >
                {/* Calendario Icon */}
                <div className="w-12 h-14 bg-white rounded-[10px] border border-slate-200 flex flex-col justify-center items-center shrink-0">
                  <span className="text-slate-900 text-lg font-bold font-['Inter'] leading-none">{item.day}</span>
                  <span className="text-teal-700 text-[9px] font-semibold font-['Inter'] mt-1">{item.month}</span>
                </div>
                
                {/* Info Text */}
                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                  <div className="flex justify-between items-center gap-2 w-full">
                    <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate">{item.title}</span>
                    <div className={`px-2 py-0.5 rounded-full shrink-0 ${getBadgeStyle(item.statusColor)}`}>
                      <span className="text-[10px] font-semibold font-['Inter'] uppercase tracking-wider">{item.status}</span>
                    </div>
                  </div>
                  <span className="text-slate-600 text-xs font-normal font-['Inter'] truncate">{item.professional}</span>
                  <span className="text-slate-500 text-[10px] font-normal font-['Inter'] truncate">{item.timeLoc}</span>
                </div>
                
                {/* Chevron */}
                <span className="text-slate-400 text-2xl font-light pl-2 shrink-0">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Detalle de Atención (Solo renderiza si hay una seleccionada) */}
        {selectedAtencion && (
          <div className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
            
            {/* Cabecera Detalle */}
            <div className="pb-5 border-b border-slate-200 flex flex-col gap-3">
              <div className={`self-start px-2.5 py-1 rounded-full ${getBadgeStyle(selectedAtencion.statusColor)}`}>
                <span className="text-[10px] font-semibold font-['Inter'] uppercase tracking-wider">
                  {selectedAtencion.status}
                </span>
              </div>
              <h2 className="text-slate-900 text-xl font-bold font-['Inter']">{selectedAtencion.title}</h2>
              <p className="text-slate-500 text-xs font-normal font-['Inter']">{selectedAtencion.details.desc}</p>
            </div>

            {/* Campos del Detalle */}
            <div className="py-2 flex flex-col">
              
              <div className="py-3 flex flex-col gap-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs font-normal font-['Inter']">Fecha y hora</span>
                <span className="text-slate-900 text-xs font-medium font-['Inter'] whitespace-pre-line">
                  {selectedAtencion.details.dateStr}
                </span>
              </div>

              <div className="py-3 flex flex-col gap-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs font-normal font-['Inter']">Profesional</span>
                <div className="flex flex-col">
                  <span className="text-slate-900 text-xs font-medium font-['Inter']">{selectedAtencion.details.profName}</span>
                  <span className="text-slate-500 text-xs font-normal font-['Inter']">{selectedAtencion.details.profSpec}</span>
                </div>
              </div>

              <div className="py-3 flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-normal font-['Inter']">Modalidad</span>
                <span className="text-slate-900 text-xs font-medium font-['Inter']">{selectedAtencion.details.modality}</span>
              </div>
            </div>

            {/* Box de Indicaciones */}
            <div className="mt-2 p-4 bg-slate-50 rounded-xl flex flex-col gap-2 border border-slate-100">
              <span className="text-slate-900 text-xs font-semibold font-['Inter']">Indicaciones</span>
              <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-relaxed">
                {selectedAtencion.details.indications}
              </p>
            </div>

            {/* Botones de Acción (Solo si es próxima) */}
            {selectedAtencion.status === 'Próxima' && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-4 py-3 bg-teal-700 hover:bg-teal-800 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter']">
                  Ingresar a la consulta
                </button>
                <button className="flex-1 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-[10px] text-slate-900 text-sm font-semibold font-['Inter']">
                  Solicitar cambio
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}