import React from 'react';

export default function PorQue() {
  const poblaciones = [
    "Mujeres (tracto urinario corto)", "Infecciones urinarias previas", "Diabetes descontrolada",
    "Embarazo", "Trasplante renal", "Inmunodeficiencias (cáncer, VIH/SIDA)", 
    "Uso de catéter", "Cálculos renales", "Anomalías estructurales congénitas"
  ];

  const ListItem = ({ text }) => (
    <div className="flex items-start gap-2.5">
      <div className="pt-1.5"><div className="w-1.5 h-1.5 bg-teal-700 rounded-full" /></div>
      <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-5">{text}</p>
    </div>
  );

  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col justify-start items-start gap-6">
        
        <h2 className="text-teal-700 text-3xl font-semibold font-['Inter']">Por qué hacer seguimiento</h2>
        
        <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-relaxed">
          La pielonefritis tiende a atenderse tras aparecer síntomas por infecciones del tracto urinario (UTIs).<br/><br/>
          Si se controla a tiempo o no hay problemas por UTIs, las bacterias no suelen dar problemas. Ante esto es clave un seguimiento preventivo, que no registre un episodio aislado, sino cuántas veces se infecta una persona y qué factores de riesgo tiene.
        </p>

        <h3 className="text-slate-900 text-2xl lg:text-3xl font-bold font-['Inter']">Cuando una UTI puede ser peligrosa</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1 p-4 bg-teal-700 rounded-xl flex items-center gap-4">
            <span className="text-white text-4xl font-bold font-['Inter']">2+</span>
            <p className="text-teal-100 text-xs font-normal font-['Inter'] leading-tight">infecciones urinarias confirmadas en 6 meses</p>
          </div>
          <div className="flex-1 p-4 bg-teal-700 rounded-xl flex items-center gap-4">
            <span className="text-white text-4xl font-bold font-['Inter']">3+</span>
            <p className="text-teal-100 text-xs font-normal font-['Inter'] leading-tight">infecciones urinarias confirmadas en 12 meses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-2">
          {/* Señales de alerta */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-slate-900 text-base font-semibold font-['Inter']">Señales de alerta</h4>
            <div className="flex flex-col gap-2">
              <ListItem text="Fiebre y escalofríos" />
              <ListItem text="Dolor en la espalda baja" />
              <ListItem text="Ardor al orinar" />
              <ListItem text="Náuseas y vómitos" />
              <ListItem text="En niños: rechazo al alimento y problemas de crecimiento" />
            </div>
          </div>
          
          {/* Cómo se confirma */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-slate-900 text-base font-semibold font-['Inter']">Cómo se confirma</h4>
            <div className="flex flex-col gap-2">
              <ListItem text="Examen de orina (EGO) aspecto lechoso" />
              <ListItem text="Urocultivo para identificar la bacteria" />
              <ListItem text="TAC si se sospechan complicaciones" />
            </div>
          </div>

          {/* Si no se trata a tiempo */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-slate-900 text-base font-semibold font-['Inter']">Si no se trata a tiempo</h4>
            <div className="flex flex-col gap-2">
              <ListItem text="Complicación en gente con diabetes, embarazo, trasplante e inmunodeficiencias" />
              <ListItem text="Fallo del riñón, daño permanente y muerte de tejido" />
              <ListItem text="En casos extremos infección sanguínea, sepsis y shock séptico (síntomas mortales)" />
            </div>
          </div>
        </div>

        {/* Poblaciones de Riesgo */}
        <div className="w-full flex flex-col gap-3 mt-2">
          <h4 className="text-slate-900 text-sm font-semibold font-['Inter']">Poblaciones de riesgo</h4>
          <div className="flex flex-wrap gap-2">
            {poblaciones.map((pob, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-700 text-xs font-medium font-['Inter']">
                {pob}
              </span>
            ))}
          </div>
        </div>

        <p className="text-slate-400 text-xs font-normal font-['Inter'] leading-snug mt-4">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}