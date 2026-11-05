import React from 'react';

export default function ProDetalleAtencion() {
  
  // Datos mockeados de los signos vitales
  const signosVitales = [
    { label: 'Temperatura', value: '38,6 °C' },
    { label: 'Presión arterial', value: '128/82 mmHg' },
    { label: 'Frecuencia cardíaca', value: '96 lpm' },
    { label: 'Saturación', value: '97 %' }
  ];

  // Datos mockeados de los síntomas
  const sintomas = ['Fiebre', 'Escalofríos', 'Ardor al orinar', 'Dolor en la espalda baja', 'Náuseas'];

  // Datos de los exámenes solicitados
  const examenes = [
    { name: 'Examen de orina (EGO)', detail: 'Nitritos presentes, aspecto lechoso', status: 'Completado', color: 'green' },
    { name: 'Urocultivo', detail: 'Resultado en 48–72 h', status: 'Pendiente', color: 'yellow' },
    { name: 'TAC abdominal', detail: 'Solo si hay sospecha de complicaciones', status: 'Condicional', color: 'slate' }
  ];

  const getBadgeClass = (color) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Detalle de atención</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Atención 0000360 · consulta · Mateo Fuentes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Aquí puedes usar window.location.hash = '#profesional/historial' o <a> */}
          <a href="#profesional/historial" className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold font-['Inter'] shrink-0">
            Volver al historial
          </a>
          <button className="px-4 py-3 bg-rose-400 hover:bg-rose-500 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0">
            Completar atención
          </button>
        </div>
      </div>

      {/* Alerta de Gravedad (Banner) */}
      <div className="w-full px-5 py-3.5 bg-red-100 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
        <div className="flex items-start gap-3.5">
          <div className="w-2.5 h-2.5 mt-1 bg-red-600 rounded-full shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-red-700 text-sm font-semibold font-['Inter']">Atención de gravedad extrema</span>
            <span className="text-slate-600 text-xs font-normal font-['Inter'] leading-relaxed">
              El paciente registra 3 infecciones urinarias confirmadas en 12 meses. Prioriza su seguimiento.
            </span>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0">
          Enviar alerta por correo
        </button>
      </div>

      {/* Grid de Resumen Rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium font-['Inter']">Gravedad</span>
          <span className="text-red-700 text-2xl lg:text-3xl font-bold font-['Inter']">Extremo</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium font-['Inter']">Estado</span>
          <span className="text-blue-700 text-2xl lg:text-3xl font-bold font-['Inter']">En proceso</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium font-['Inter']">Tipo de atención</span>
          <span className="text-slate-900 text-2xl lg:text-3xl font-bold font-['Inter']">Consulta</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium font-['Inter']">Fecha · 11:30 hrs</span>
          <span className="text-slate-900 text-2xl lg:text-3xl font-bold font-['Inter']">05/10/26</span>
        </div>
      </div>

      {/* Contenido Principal a dos columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Columna Izquierda: Información Clínica */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-5">
          <h2 className="text-slate-900 text-base font-semibold font-['Inter']">Información clínica</h2>
          
          {/* Signos Vitales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {signosVitales.map((signo, idx) => (
              <div key={idx} className="px-3.5 py-3 bg-slate-50 rounded-xl flex flex-col gap-0.5 border border-slate-100">
                <span className="text-slate-500 text-xs font-medium font-['Inter']">{signo.label}</span>
                <span className="text-slate-900 text-base font-bold font-['Inter']">{signo.value}</span>
              </div>
            ))}
          </div>
          
          <hr className="border-slate-200" />
          
          {/* Motivo de Consulta */}
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold font-['Inter']">Motivo de consulta</span>
            <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">
              Dolor en la espalda baja, fiebre y ardor al orinar desde hace 3 días.
            </p>
          </div>
          
          <hr className="border-slate-200" />
          
          {/* Síntomas Reportados (Tags) */}
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 text-xs font-semibold font-['Inter']">Síntomas reportados</span>
            <div className="flex flex-wrap gap-2">
              {sintomas.map((sintoma, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold font-['Inter']">
                  {sintoma}
                </span>
              ))}
            </div>
          </div>
          
          <hr className="border-slate-200" />
          
          {/* Observaciones Clínicas */}
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold font-['Inter']">Observaciones clínicas</span>
            <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">
              Paciente con diabetes tipo 2 descontrolada y antecedentes de infecciones urinarias recurrentes. Dolor a la percusión lumbar derecha. Orina de aspecto lechoso.
            </p>
          </div>
          
          <hr className="border-slate-200" />
          
          {/* Plan e indicaciones */}
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold font-['Inter']">Plan e indicaciones</span>
            <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">
              Solicitar examen de orina y urocultivo. Evaluar TAC si hay sospecha de complicaciones. Reforzar hidratación y control en 7 días.
            </p>
          </div>
        </div>

        {/* Columna Derecha: Widgets Secundarios */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          
          {/* Widget: Paciente */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Paciente</h3>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-700/30 rounded-full flex justify-center items-center shrink-0">
                <span className="text-red-700 text-sm font-semibold font-['Inter']">MF</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">Mateo Fuentes</span>
                <span className="text-slate-500 text-xs font-normal font-['Inter']">67 años · Masculino · PAC-001284</span>
              </div>
            </div>
            <button className="text-teal-700 hover:text-teal-800 text-left text-xs font-semibold font-['Inter'] hover:underline mt-1">
              Ver historial del paciente
            </button>
          </div>

          {/* Widget: Profesional a cargo */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Profesional a cargo</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-700/30 rounded-xl flex justify-center items-center shrink-0">
                <span className="text-red-700 text-xs font-semibold font-['Inter']">FT</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">Freddy Turbina</span>
                <span className="text-slate-500 text-xs font-normal font-['Inter']">Médico Cirujano</span>
              </div>
            </div>
          </div>

          {/* Widget: Exámenes Solicitados */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Exámenes solicitados</h3>
            
            <div className="flex flex-col gap-3">
              {examenes.map((examen, idx) => (
                <div key={idx} className="flex flex-col">
                  {idx !== 0 && <hr className="border-slate-200 mb-3" />}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 text-sm font-normal font-['Inter']">{examen.name}</span>
                      <span className="text-slate-500 text-xs font-normal font-['Inter'] leading-snug">{examen.detail}</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full flex justify-center items-center shrink-0 ${getBadgeClass(examen.color)}`}>
                      <span className="text-xs font-semibold font-['Inter']">{examen.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}