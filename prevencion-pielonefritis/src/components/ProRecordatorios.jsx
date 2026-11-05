import React, { useState } from 'react';

export default function ProRecordatorios() {
  const [activeTab, setActiveTab] = useState('Mis tareas');

  // KPIs de gestión de tiempo y seguimiento
  const kpis = [
    { label: 'Tareas pendientes', value: '5', color: 'text-red-700' },
    { label: 'Exámenes por revisar', value: '2', color: 'text-amber-600' },
    { label: 'Alertas de pacientes', value: '3', color: 'text-red-700' },
    { label: 'Recordatorios enviados', value: '12', color: 'text-slate-900' },
  ];

  // Datos mockeados de recordatorios/tareas
  const recordatorios = [
    {
      id: 1,
      type: 'examen',
      title: 'Revisar Urocultivo',
      patient: 'Mateo Fuentes',
      time: 'Hoy · 14:00',
      description: 'El laboratorio debería haber subido los resultados del urocultivo. Revisar para ajustar antibiótico si es necesario.',
      priority: 'Alta',
      color: 'red',
      tab: 'Mis tareas'
    },
    {
      id: 2,
      type: 'alerta',
      title: 'Paciente sin registro',
      patient: 'Joaquín Pérez',
      time: 'Hace 2 días',
      description: 'Paciente en riesgo extremo no ha registrado su temperatura en las últimas 48 hrs.',
      priority: 'Media',
      color: 'amber',
      tab: 'Alertas'
    },
    {
      id: 3,
      type: 'enviado',
      title: 'Subir orden de exámenes',
      patient: 'Sofía Herrera',
      time: 'Ayer · 09:00',
      description: 'Recordatorio automático enviado a la paciente para que adjunte su EGO.',
      priority: 'Baja',
      color: 'slate',
      tab: 'Enviados'
    },
    {
      id: 4,
      type: 'tarea',
      title: 'Llamar a paciente',
      patient: 'Camila Soto',
      time: 'Mañana · 10:00',
      description: 'Llamar para verificar tolerancia al nuevo tratamiento indicado ayer.',
      priority: 'Alta',
      color: 'red',
      tab: 'Mis tareas'
    }
  ];

  // Filtramos según el tab activo
  const filteredTasks = recordatorios.filter(r => r.tab === activeTab);

  // Helper de colores para los badges de prioridad
  const getPriorityStyle = (color) => {
    switch(color) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'slate': default: return 'bg-slate-200 text-slate-600';
    }
  };

  // Helper para iconos según tipo de tarea
  const getTaskIcon = (type) => {
    switch(type) {
      case 'examen': return '🔬';
      case 'alerta': return '⚠️';
      case 'enviado': return '📤';
      case 'tarea': default: return '📋';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Centro de Comando Clínico</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Gestiona tus tareas, revisa alertas automáticas y envía recordatorios a tus pacientes.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-3 bg-white hover:bg-slate-50 transition-colors border border-slate-200 rounded-[10px] text-slate-900 text-sm font-semibold font-['Inter'] shadow-sm">
            Crear mi tarea
          </button>
          <button className="flex-1 sm:flex-none px-4 py-3 bg-red-700 hover:bg-red-800 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shadow-sm">
            Enviar a paciente
          </button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
            <span className="text-slate-500 text-[10px] sm:text-xs font-medium font-['Inter'] uppercase tracking-wide">
              {kpi.label}
            </span>
            <span className={`text-2xl sm:text-3xl font-bold font-['Inter'] ${kpi.color}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Layout Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm flex-1">
        
        {/* Navegación por Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {['Mis tareas', 'Alertas', 'Enviados'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold font-['Inter'] transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-red-700 text-red-700 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista de Tareas/Recordatorios */}
        <div className="flex flex-col p-2 gap-2 overflow-y-auto">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
                
                {/* Info Izquierda */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex justify-center items-center shrink-0 border border-slate-200 text-lg">
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-slate-900 text-sm font-bold font-['Inter']">{task.title}</h3>
                      <div className={`px-2 py-0.5 rounded-full flex justify-center items-center shrink-0 ${getPriorityStyle(task.color)}`}>
                        <span className="text-[10px] font-bold font-['Inter'] uppercase tracking-wider">{task.priority}</span>
                      </div>
                    </div>
                    <span className="text-slate-600 text-xs font-semibold font-['Inter']">
                      Paciente: <span className="font-normal">{task.patient}</span> · <span className="font-normal text-slate-500">{task.time}</span>
                    </span>
                    <p className="text-slate-500 text-xs font-normal font-['Inter'] mt-1 max-w-2xl leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Acciones Derecha (dependiendo del tipo) */}
                <div className="w-full md:w-auto flex justify-end gap-2 mt-2 md:mt-0 shrink-0">
                  {task.tab === 'Mis tareas' && (
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-['Inter'] transition-colors">
                      Marcar completada
                    </button>
                  )}
                  {task.tab === 'Alertas' && (
                    <button className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-semibold font-['Inter'] transition-colors">
                      Enviar recordatorio al paciente
                    </button>
                  )}
                  {task.tab === 'Enviados' && (
                    <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-['Inter'] transition-colors">
                      Ver mensaje enviado
                    </button>
                  )}
                  <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-teal-700 rounded-lg text-xs font-semibold font-['Inter'] transition-colors">
                    Ver ficha
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-4xl mb-3">☕</span>
              <p className="text-sm font-semibold font-['Inter']">No hay tareas en esta sección</p>
              <p className="text-xs font-normal font-['Inter'] mt-1">¡Todo al día por aquí!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}