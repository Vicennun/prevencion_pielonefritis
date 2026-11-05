import React, { useState } from 'react';

export default function ProPacientes() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Datos para los KPIs
  const kpis = [
    { label: 'Pacientes asignados', value: '48', valueColor: 'text-slate-900' },
    { label: 'En riesgo extremo', value: '3', valueColor: 'text-red-700' },
    { label: 'Atenciones en proceso', value: '12', valueColor: 'text-blue-700' },
    { label: 'Mensajes sin leer', value: '7', valueColor: 'text-slate-900' },
  ];

  // Datos para los filtros
  const filters = [
    { label: 'Todos', count: 48 },
    { label: 'Extremo', count: 3 },
    { label: 'Alto', count: 11 },
    { label: 'Moderado', count: 19 },
    { label: 'Bajo', count: 15 },
  ];

  // Datos mockeados de la tabla de pacientes
  const pacientes = [
    { 
      initials: 'MF', initialsBg: 'bg-red-700/30', initialsColor: 'text-red-700', 
      name: 'Mateo Fuentes', age: '67', 
      risk: 'Extremo', riskColor: 'red', 
      lastUpdate: '05 oct 2026', status: 'En proceso', statusColor: 'blue' 
    },
    { 
      initials: 'JP', initialsBg: 'bg-red-700/30', initialsColor: 'text-red-700', 
      name: 'Joaquín Pérez', age: '72', 
      risk: 'Extremo', riskColor: 'red', 
      lastUpdate: '02 oct 2026', status: 'En proceso', statusColor: 'blue' 
    },
    { 
      initials: 'SH', initialsBg: 'bg-amber-100', initialsColor: 'text-yellow-600', 
      name: 'Sofía Herrera', age: '54', 
      risk: 'Alto', riskColor: 'amber', 
      lastUpdate: '03 oct 2026', status: 'En proceso', statusColor: 'blue' 
    },
    { 
      initials: 'CS', initialsBg: 'bg-amber-700/30', initialsColor: 'text-amber-700', 
      name: 'Camila Soto', age: '41', 
      risk: 'Moderado', riskColor: 'yellow', 
      lastUpdate: '28 sep 2026', status: 'Completado', statusColor: 'green' 
    },
    { 
      initials: 'DV', initialsBg: 'bg-teal-100', initialsColor: 'text-teal-800', 
      name: 'Daniela Vera', age: '36', 
      risk: 'Bajo', riskColor: 'green', 
      lastUpdate: '20 sep 2026', status: 'Completado', statusColor: 'green' 
    },
    { 
      initials: 'IR', initialsBg: 'bg-amber-100', initialsColor: 'text-yellow-600', 
      name: 'Ignacio Rivas', age: '59', 
      risk: 'Alto', riskColor: 'amber', 
      lastUpdate: '15 sep 2026', status: 'Cancelado', statusColor: 'slate' 
    },
  ];

  // Helper para generar las clases CSS de las etiquetas de riesgo y estado
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
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Panel de pacientes</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            48 pacientes asignados · actualizado hoy
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

      {/* Alerta de Riesgo Extremo */}
      <div className="w-full px-5 py-3.5 bg-red-100 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
        <div className="flex items-start gap-3.5">
          <div className="w-2.5 h-2.5 mt-1 bg-red-600 rounded-full shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-red-700 text-sm font-semibold font-['Inter']">3 pacientes en riesgo extremo</span>
            <span className="text-slate-600 text-xs font-normal font-['Inter'] leading-relaxed">
              Envía una alerta por correo para priorizar su seguimiento.
            </span>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0">
          Enviar alerta por correo
        </button>
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
            placeholder="Buscar paciente…" 
            className="w-full bg-transparent text-slate-700 placeholder:text-gray-500 text-xs font-normal font-['Inter'] focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla de Pacientes */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        
        {/* Header de la Tabla (Oculto en móviles) */}
        <div className="hidden md:flex items-center px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex-1 min-w-[200px] text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Paciente</div>
          <div className="w-16 lg:w-20 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Edad</div>
          <div className="w-28 lg:w-32 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Riesgo</div>
          <div className="w-32 lg:w-40 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Última atención</div>
          <div className="w-28 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Estado</div>
          <div className="w-24"></div> {/* Espacio para el botón */}
        </div>

        {/* Cuerpo de la Tabla */}
        <div className="flex flex-col">
          {pacientes.map((row, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 gap-3 md:gap-0 hover:bg-slate-50 transition-colors ${
                index !== pacientes.length - 1 ? 'border-b border-slate-200' : ''
              }`}
            >
              
              {/* Celda: Paciente */}
              <div className="flex-1 min-w-[200px] flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex justify-center items-center shrink-0 ${row.initialsBg}`}>
                  <span className={`text-xs font-semibold font-['Inter'] ${row.initialsColor}`}>{row.initials}</span>
                </div>
                <span className="text-slate-900 text-sm md:text-base font-semibold md:font-normal font-['Inter']">
                  {row.name}
                </span>
              </div>

              {/* Celda: Edad */}
              <div className="w-full md:w-16 lg:w-20">
                <span className="text-slate-600 text-sm font-normal font-['Inter']">
                  <span className="md:hidden font-semibold">Edad: </span>{row.age}
                </span>
              </div>

              {/* Celda: Riesgo */}
              <div className="w-full md:w-28 lg:w-32 flex items-center">
                <span className="md:hidden text-slate-600 text-sm font-semibold font-['Inter'] mr-2">Riesgo:</span>
                <div className={`px-2.5 py-1 rounded-full flex justify-center items-center ${getBadgeClasses(row.riskColor)}`}>
                  <span className="text-xs font-semibold font-['Inter']">{row.risk}</span>
                </div>
              </div>

              {/* Celda: Última Atención */}
              <div className="w-full md:w-32 lg:w-40">
                <span className="text-slate-600 text-xs font-normal font-['Inter']">
                  <span className="md:hidden font-semibold">Última atención: </span>{row.lastUpdate}
                </span>
              </div>

              {/* Celda: Estado */}
              <div className="w-full md:w-28 flex items-center">
                <span className="md:hidden text-slate-600 text-sm font-semibold font-['Inter'] mr-2">Estado:</span>
                <div className={`px-2.5 py-1 rounded-full flex justify-center items-center ${getBadgeClasses(row.statusColor)}`}>
                  <span className="text-xs font-semibold font-['Inter']">{row.status}</span>
                </div>
              </div>

              {/* Celda: Acción (Modificado para navegar al detalle) */}
              <div className="w-full md:w-24 flex justify-end md:justify-center mt-2 md:mt-0">
                <a 
                  href="#profesional/detalle-paciente"
                  className="text-teal-700 hover:text-teal-800 text-xs font-semibold font-['Inter'] hover:underline"
                >
                  Ver historial
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}