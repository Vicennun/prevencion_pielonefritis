import React from 'react';

export default function Vision() {
  const visionItems = [
    {
      num: '1',
      title: 'Pielonefritis evitables',
      desc: 'Identificar a tiempo a quienes tienen infecciones urinarias recurrentes, para intervenir antes de que la infección ascienda a los riñones y derive en sepsis, daño renal o peor.'
    },
    {
      num: '2',
      title: 'Registro clínico',
      desc: 'Cada infección confirmada, factor de riesgo y control queda en un solo registro, disponible para el profesional que atiende al paciente.'
    },
    {
      num: '3',
      title: 'Pacientes que reconocen las señales',
      desc: 'Personas informadas que identifican a tiempo los síntomas (como fiebre, escalofríos, dolor en espalda baja, etc.) consultan y actúan sin demora.'
    }
  ];

  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col justify-start items-start gap-6">
        
        <div className="px-3 py-1 bg-teal-50 rounded-full border border-teal-200 inline-flex">
          <span className="text-teal-700 text-sm font-semibold font-['Inter']">Visión</span>
        </div>

        <h2 className="text-slate-900 text-3xl font-bold font-['Inter'] leading-8">
          Un seguimiento que se anticipa a la complicación
        </h2>
        
        <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-relaxed">
          Nuestra prioridad es que ningún paciente de riesgo llegue a una Pielonefritis sin al menos haber sido identificado antes. Hoy la atención suele comenzar después de los síntomas: nuestra visión es adelantar ese momento con registros, alertas, prevención y educación.
        </p>

        <div className="w-full flex flex-col gap-4 mt-2">
          {visionItems.map((item, index) => (
            <div key={index} className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-9 h-9 shrink-0 bg-teal-50 rounded-2xl border border-teal-200 flex justify-center items-center">
                <span className="text-teal-700 text-sm font-bold font-['Inter']">{item.num}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-slate-900 text-base font-semibold font-['Inter']">{item.title}</h3>
                <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-xs font-normal font-['Inter'] leading-snug mt-4">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}