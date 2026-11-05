import React, { useState } from 'react';

export default function ProHistorial() {
  // Estado para el filtro seleccionado
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Datos de las estadísticas (KPIs)
  const kpis = [
    { label: 'Atenciones históricas', value: '+300', valueColor: 'text-slate-900' },
    { label: 'Atenciones exitosas', value: '+60%', valueColor: 'text-red-700' },
    { label: 'Atenciones en proceso', value: '3', valueColor: 'text-blue-700' },
    { label: 'Mensajes sin leer', value: '7', valueColor: 'text-slate-900' },
  ];

  // Datos para los filtros tipo "píldora"
  const filters = [
    { label: 'Todos', count: 360 },
    { label: 'En proceso', count: 3 },
    { label: 'Completado', count: 220 },
    { label: 'Cancelado', count: 55 },
    { label: 'Reagendado', count: 82 },
  ];

  // Datos mockeados de la tabla
  const atenciones = [
    { id: '0000360', patient: 'Mateo Fuentes', type: 'consulta', severity: 'Extremo', severityColor: 'red', date: '05/10/26 (11:30)', status: 'En proceso', statusColor: 'blue' },
    { id: '0000359', patient: 'Bastian Cifuentes', type: 'control', severity: 'Extremo', severityColor: 'red', date: '05/10/26 (09:30)', status: 'En proceso', statusColor: 'blue' },
    { id: '0000358', patient: 'Joaquin Perez', type: 'procedimiento', severity: 'Alto', severityColor: 'amber', date: '02/10/26 (16:00)', status: 'En proceso', statusColor: 'blue' },
    { id: '0000357', patient: 'John Doe', type: 'consulta', severity: 'Moderado', severityColor: 'yellow', date: '02/10/26 (14:00)', status: 'Completado', statusColor: 'green' },
    { id: '0000356', patient: 'Matías Carvajal', type: 'procedimiento', severity: 'Bajo', severityColor: 'green', date: '02/10/26 (11:30)', status: 'Completado', statusColor: 'green' },
    { id: '0000355', patient: 'Manuel Quezada', type: 'consulta', severity: 'Alto', severityColor: 'amber', date: '01/10/26 (15:00)', status: 'Cancelado', statusColor: 'slate' },
  ];

  // Helper para generar las clases CSS de las etiquetas de gravedad y estado
  const getBadgeClasses = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'slate': default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Historial de atenciones</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Administra, gestiona y revisa tus atenciones históricas como profesional
          </p>
        </div>
        
        {/* Botones de acción principal */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold font-['Inter'] shrink-0">
            Mensaje a varios pacientes
          </button>
          <button className="px-4 py-3 bg-rose-400 hover:bg-rose-500 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0">
            Nuevo paciente
          </button>
        </div>
      </div>

      {/* Grid de KPIs / Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
            <span className="text-slate-500 text-xs font-medium font-['Inter'] uppercase tracking-wide">
              {kpi.label}
            </span>
            <span className={`text-3xl font-bold font-['Inter'] ${kpi.valueColor}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Contenedor de Filtros y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-3.5 py-2 rounded-full border transition-colors flex items-center gap-1 ${
                activeFilter === filter.label 
                  ? 'bg-rose-400 text-white border-transparent' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-semibold font-['Inter']">
                {filter.label} · {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="w-full md:w-96 px-3.5 py-2 bg-neutral-300 rounded-full border border-slate-200 flex items-center">
          <input 
            type="text" 
            placeholder="Buscar por paciente…" 
            className="w-full bg-transparent text-slate-700 placeholder:text-gray-500 text-xs font-normal font-['Inter'] focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla de Atenciones */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        
        {/* Header de la Tabla (Oculto en móviles para simplificar, visible desde md) */}
        <div className="hidden md:flex items-center px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="w-20 lg:w-24 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">id_atencion</div>
          <div className="flex-1 min-w-[150px] text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Paciente</div>
          <div className="w-32 lg:w-40 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Tipo de atencion</div>
          <div className="w-24 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Gravedad</div>
          <div className="w-32 lg:w-40 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Fecha/hora</div>
          <div className="w-24 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Estado</div>
          <div className="w-24"></div> {/* Espacio para el botón de acción */}
        </div>

        {/* Cuerpo de la Tabla */}
        <div className="flex flex-col">
          {atenciones.map((row, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 gap-3 md:gap-0 hover:bg-slate-50 transition-colors ${
                index !== atenciones.length - 1 ? 'border-b border-slate-200' : ''
              }`}
            >
              
              {/* Celda: ID (En móvil se ve arriba pequeño) */}
              <div className="w-full md:w-20 lg:w-24">
                <span className="text-slate-500 md:text-slate-900 text-xs md:text-sm font-semibold font-['Inter']">
                  <span className="md:hidden">ID: </span>{row.id}
                </span>
              </div>

              {/* Celda: Paciente */}
              <div className="flex-1 min-w-[150px]">
                <span className="text-slate-900 text-sm md:text-base font-semibold md:font-normal font-['Inter']">
                  {row.patient}
                </span>
              </div>

              {/* Celda: Tipo */}
              <div className="w-full md:w-32 lg:w-40">
                <span className="text-slate-600 text-sm font-normal font-['Inter'] capitalize">
                  <span className="md:hidden font-semibold">Tipo: </span>{row.type}
                </span>
              </div>

              {/* Celda: Gravedad */}
              <div className="w-full md:w-24 flex items-center">
                <span className="md:hidden text-slate-600 text-sm font-semibold font-['Inter'] mr-2">Gravedad:</span>
                <div className={`px-2.5 py-1 rounded-full flex justify-center items-center ${getBadgeClasses(row.severityColor)}`}>
                  <span className="text-xs font-semibold font-['Inter']">{row.severity}</span>
                </div>
              </div>

              {/* Celda: Fecha/Hora */}
              <div className="w-full md:w-32 lg:w-40">
                <span className="text-slate-600 text-xs font-normal font-['Inter']">
                  <span className="md:hidden font-semibold">Fecha: </span>{row.date}
                </span>
              </div>

              {/* Celda: Estado */}
              <div className="w-full md:w-24 flex items-center">
                <span className="md:hidden text-slate-600 text-sm font-semibold font-['Inter'] mr-2">Estado:</span>
                <div className={`px-2.5 py-1 rounded-full flex justify-center items-center ${getBadgeClasses(row.statusColor)}`}>
                  <span className="text-xs font-semibold font-['Inter']">{row.status}</span>
                </div>
              </div>

              {/* Celda: Acción (Modificado para navegar al detalle) */}
              <div className="w-full md:w-24 flex justify-end md:justify-center mt-2 md:mt-0">
                <a 
                  href="#profesional/detalle-atencion"
                  className="text-teal-700 hover:text-teal-800 text-xs font-semibold font-['Inter'] hover:underline"
                >
                  Ver detalles
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}