import React, { useState } from 'react';

export default function ProSeguimientoActivo() {
  
  // Base de datos simulada con 3 pacientes en distintos estados clínicos
  const patientsDb = [
    {
      id: 'PAC-001284',
      name: 'Mateo Fuentes',
      diagnosisDate: '01/10/2026',
      daysInTreatment: 3,
      currentAntibiotic: 'Ciprofloxacino 500mg',
      comorbidities: ['Diabetes tipo 2', 'Infecciones previas'],
      triageAssessment: {
        level: 'Rojo',
        colorStyle: 'red',
        title: 'Valoración presencial el mismo día',
        triggers: ['Fiebre ≥ 38 °C (38.6 °C)', 'Dolor lumbar intenso (7/10)'],
        systemMessage: 'El paciente presenta criterios rojos activos. Se requiere valoración presencial el mismo día independientemente de otros factores. Alerta metabólica activa.',
      },
      metrics: [
        { name: 'Temperatura', current: '38.6 °C', previous: '37.1 °C', status: 'Alerta Roja', statusColor: 'red', ruleDetail: '≥ 38 °C en contexto de IVU activa', icon: '🌡️' },
        { name: 'Dolor Lumbar', current: '7 / 10', previous: '4 / 10', status: 'Alerta Roja', statusColor: 'red', ruleDetail: 'Dolor intenso ≥ 7/10 o creciente', icon: '📊' },
        { name: 'Glucosa Capilar', current: '265 mg/dL', previous: '140 mg/dL', status: 'Alerta Metabólica', statusColor: 'amber', ruleDetail: '≥ 250 mg/dL durante enfermedad', icon: '🩸' },
        { name: 'Urocultivo', current: 'E. Coli (>100k)', previous: 'Muestra', status: 'Pendiente revisión', statusColor: 'blue', ruleDetail: 'Sensible a Ciprofloxacino.', icon: '🧫' }
      ],
      timeline: [
        { day: 'Hoy', status: 'Resultado disponible', desc: 'E. Coli (>100k UFC). Sensible a Ciprofloxacino. Requiere validación médica.', color: 'blue' },
        { day: '-1d', status: 'Muestra recolectada', desc: 'Ingresada en laboratorio central.', color: 'slate' }
      ]
    },
    {
      id: 'PAC-002391',
      name: 'Sofía Herrera',
      diagnosisDate: '03/10/2026',
      daysInTreatment: 2,
      currentAntibiotic: 'Cefadroxilo 500mg',
      comorbidities: ['Embarazo (22 semanas)'],
      triageAssessment: {
        level: 'Amarillo (Modificado)',
        colorStyle: 'amber',
        title: 'Valoración Pronta (Riesgo Obstétrico)',
        triggers: ['Febrícula (37.6 °C)', 'Gestante'],
        systemMessage: 'Paciente gestante con síntomas urinarios persistentes. Aunque los síntomas base son amarillos (vigilar), el embarazo modifica la prioridad requiriendo evaluación presencial urgente u obstétrica.',
      },
      metrics: [
        { name: 'Temperatura', current: '37.6 °C', previous: '36.9 °C', status: 'Vigilar', statusColor: 'amber', ruleDetail: '37.5–37.9 °C (Amarillo)', icon: '🌡️' },
        { name: 'Dolor Lumbar', current: '5 / 10', previous: '5 / 10', status: 'Moderado', statusColor: 'amber', ruleDetail: 'Dolor 4-6/10 (Amarillo)', icon: '📊' },
        { name: 'Hidratación', current: '4 vasos', previous: '5 vasos', status: 'Baja ingesta', statusColor: 'slate', ruleDetail: 'Registrar volumen (No dispara alerta clínica)', icon: '💧' },
        { name: 'Urocultivo', current: 'Pendiente', previous: 'No solicitado', status: 'En proceso', statusColor: 'slate', ruleDetail: 'Muestra enviada hoy temprano.', icon: '🧫' }
      ],
      timeline: [
        { day: 'Hoy', status: 'Muestra recolectada', desc: 'Urocultivo ingresado en laboratorio.', color: 'slate' },
        { day: '-2d', status: 'Diagnóstico Inicial', desc: 'Inicio de síntomas urinarios bajos. Se indica Cefadroxilo.', color: 'amber' }
      ]
    },
    {
      id: 'PAC-003442',
      name: 'Daniela Vera',
      diagnosisDate: '28/09/2026',
      daysInTreatment: 7,
      currentAntibiotic: 'Nitrofurantoína 100mg',
      comorbidities: ['Ninguna'],
      triageAssessment: {
        level: 'Verde',
        colorStyle: 'green',
        title: 'Sin señales de alarma',
        triggers: ['Apirética', 'Sin dolor', 'Urocultivo (-)' ],
        systemMessage: 'No se han registrado señales de alarma. Paciente asintomática tras completar esquema antibiótico. El urocultivo de control confirma curación bacteriológica.',
      },
      metrics: [
        { name: 'Temperatura', current: '36.5 °C', previous: '36.7 °C', status: 'Normal', statusColor: 'green', ruleDetail: '< 37.5 °C', icon: '🌡️' },
        { name: 'Dolor Lumbar', current: '0 / 10', previous: '0 / 10', status: 'Sin dolor', statusColor: 'green', ruleDetail: 'Ausencia de dolor', icon: '📊' },
        { name: 'Síntomas urinarios', current: 'Ninguno', previous: 'Leve ardor', status: 'Resuelto', statusColor: 'green', ruleDetail: 'Resolución clínica completa', icon: '✅' },
        { name: 'Urocultivo', current: 'Negativo', previous: 'Pendiente', status: 'Completado', statusColor: 'green', ruleDetail: 'Resultado validado por laboratorio.', icon: '🧫' }
      ],
      timeline: [
        { day: 'Hoy', status: 'Resultado Revisado', desc: 'Urocultivo de control negativo. Criterios de curación cumplidos.', color: 'green' },
        { day: '-3d', status: 'Muestra recolectada', desc: 'Urocultivo de control post-tratamiento.', color: 'slate' }
      ]
    }
  ];

  // Estado para manejar el paciente seleccionado
  const [selectedPatientId, setSelectedPatientId] = useState(patientsDb[0].id);

  // Obtener los datos del paciente actual
  const currentData = patientsDb.find(p => p.id === selectedPatientId);

  // Helper para colores
  const getStyle = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Selector de Pacientes (Top Bar) */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2 shrink-0">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
          Simular Paciente:
        </div>
        {patientsDb.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPatientId(p.id)}
            className={`px-4 py-2 text-sm font-semibold font-['Inter'] rounded-lg transition-all ${
              selectedPatientId === p.id 
                ? 'bg-red-700 text-white shadow-md' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0 mt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-semibold font-['Inter'] tracking-wide uppercase">
              Monitor de Evaluación Clínica
            </span>
            <span className="px-2 py-0.5 bg-slate-700 text-white text-[10px] font-bold rounded flex items-center gap-1">
              <span>🚦</span> SEMÁFORO ACTIVO
            </span>
          </div>
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Seguimiento de Infección</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Triage por reglas clínicas para {currentData.name} ({currentData.id})
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a href="#profesional/detalle-paciente" className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold font-['Inter']">
            Volver a la ficha
          </a>
        </div>
      </div>

      {/* Widget Principal: Motor Semáforo Clínico */}
      <div className={`p-6 bg-white rounded-2xl border-2 ${currentData.triageAssessment.colorStyle === 'red' ? 'border-red-500' : (currentData.triageAssessment.colorStyle === 'amber' ? 'border-amber-500' : 'border-green-500')} flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm shrink-0 relative overflow-hidden transition-colors duration-300`}>
        
        {/* Fondo sutil según color */}
        <div className={`absolute inset-0 opacity-10 pointer-events-none ${
          currentData.triageAssessment.colorStyle === 'red' ? 'bg-red-500' : 
          (currentData.triageAssessment.colorStyle === 'amber' ? 'bg-amber-500' : 'bg-green-500')
        }`} />

        <div className="flex-1 flex flex-col gap-4 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl border-2 flex justify-center items-center shrink-0 ${getStyle(currentData.triageAssessment.colorStyle)}`}>
              <span className="text-3xl">
                {currentData.triageAssessment.colorStyle === 'red' ? '🚨' : (currentData.triageAssessment.colorStyle === 'amber' ? '⚠️' : '✅')}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-slate-900 text-xl font-bold font-['Inter']">Nivel: {currentData.triageAssessment.level}</h2>
                <div className={`px-2.5 py-1 rounded-full border ${getStyle(currentData.triageAssessment.colorStyle)}`}>
                  <span className="text-xs font-bold uppercase">{currentData.triageAssessment.title}</span>
                </div>
              </div>
              
              {/* Desglose de triggers */}
              <div className="flex flex-wrap gap-2 mt-1">
                {currentData.triageAssessment.triggers.map((trigger, idx) => (
                  <span key={idx} className={`px-2 py-0.5 border text-[10px] font-bold rounded ${getStyle(currentData.triageAssessment.colorStyle)}`}>
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-slate-700 text-sm font-normal font-['Inter'] leading-relaxed max-w-3xl border-l-2 border-slate-300 pl-3">
            <strong>Lectura del protocolo:</strong> {currentData.triageAssessment.systemMessage}
          </p>
          
          <div className="flex flex-wrap gap-6 mt-1">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Días en tratamiento</span>
              <span className="text-slate-900 text-sm font-semibold">{currentData.daysInTreatment} días (Iniciado: {currentData.diagnosisDate})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Antibiótico actual</span>
              <span className="text-slate-900 text-sm font-semibold">{currentData.currentAntibiotic}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Condiciones Previas</span>
              <span className="text-slate-900 text-sm font-semibold">{currentData.comorbidities.join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción Inmediata dinámicos */}
        <div className="flex flex-col gap-3 w-full xl:w-auto relative z-10 shrink-0">
          {currentData.triageAssessment.colorStyle === 'red' && (
            <button className="px-6 py-4 bg-red-600 hover:bg-red-700 transition-colors rounded-xl text-white text-sm font-bold shadow-md">
              Citar a valoración presencial hoy
            </button>
          )}
          {currentData.triageAssessment.colorStyle === 'amber' && (
            <button className="px-6 py-4 bg-amber-500 hover:bg-amber-600 transition-colors rounded-xl text-white text-sm font-bold shadow-md">
              Evaluar / Ajustar Tratamiento
            </button>
          )}
          {currentData.triageAssessment.colorStyle === 'green' && (
            <button className="px-6 py-4 bg-green-600 hover:bg-green-700 transition-colors rounded-xl text-white text-sm font-bold shadow-md">
              Generar Alta Médica
            </button>
          )}
        </div>
      </div>

      {/* Grid de Métricas Clínicas */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
          <h3 className="text-slate-900 text-lg font-bold font-['Inter']">Datos del Semáforo (Exámenes y Reportes)</h3>
          <span className="text-slate-500 text-xs font-medium">Última sincronización: Hoy 08:30 hrs</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {currentData.metrics.map((metric, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
              
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex justify-center items-center text-xl border border-slate-100">
                  {metric.icon}
                </div>
                <div className={`px-2.5 py-1 rounded-full border ${getStyle(metric.statusColor)}`}>
                  <span className="text-[10px] font-bold uppercase">{metric.status}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-slate-500 text-xs font-semibold font-['Inter'] line-clamp-1">{metric.name}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-900 text-2xl font-bold font-['Inter']">{metric.current}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-1 mt-auto">
                <span className="text-slate-500 text-[10px] font-semibold">{metric.ruleDetail}</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-400 text-[10px] font-medium uppercase">Registro Anterior</span>
                  <span className="text-slate-600 text-[10px] font-semibold">{metric.previous}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observaciones y Acciones de Soporte */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start shrink-0">
        
        {/* Trazabilidad del Urocultivo */}
        <div className="xl:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
          <h3 className="text-slate-900 text-base font-bold font-['Inter']">Trazabilidad Clínica</h3>
          
          <div className="flex flex-col gap-0">
            {currentData.timeline.map((event, idx) => (
              <div key={idx} className={`flex gap-4 relative ${idx !== currentData.timeline.length -1 ? 'pb-6' : ''}`}>
                {idx !== currentData.timeline.length - 1 && (
                  <div className="w-px h-full bg-slate-200 absolute left-[15px] top-6" />
                )}
                <div className={`w-8 h-8 rounded-full border-2 flex justify-center items-center shrink-0 z-10 ${getStyle(event.color)}`}>
                  <span className={`text-[10px] font-bold`}>{event.day}</span>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-slate-900 text-sm font-semibold">{event.status}</span>
                  <span className="text-slate-500 text-xs font-normal">
                    {event.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Clínicas Documentadas */}
        <div className="xl:col-span-1 p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4 shadow-sm">
          <h3 className="text-red-700 text-base font-bold font-['Inter']">Gestión Manual</h3>
          <p className="text-slate-600 text-xs font-normal">
            Registra las acciones y decisiones tomadas en base a las alertas actuales.
          </p>
          
          <div className="flex flex-col gap-3 mt-2">
            {/* NUEVO: Enlace a ProRevisionExamen */}
            <a href="#profesional/revision-examen" className="w-full px-4 py-3 bg-red-700 border border-red-800 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors text-left flex justify-between items-center shadow-sm">
              <span>Revisar documento pendiente</span>
              <span className="text-red-200">›</span>
            </a>
            
            <button className="w-full px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors text-left flex justify-between items-center">
              <span>Valorar estudio de imagen (TAC)</span>
              <span className="text-slate-400">›</span>
            </button>
            <button className="w-full px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors text-left flex justify-between items-center">
              <span>Ajustar metas de hidratación</span>
              <span className="text-slate-400">›</span>
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}