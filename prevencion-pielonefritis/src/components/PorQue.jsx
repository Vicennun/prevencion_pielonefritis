import React from 'react';

export default function PorQue() {
  const poblaciones = [
    'Mujeres (uretra corta)',
    'Infecciones urinarias recurrentes',
    'Diabetes mellitus',
    'Embarazo',
    'Enfermedad renal crónica o trasplante',
    'Inmunosupresión',
    'Uso de sonda urinaria',
    'Cálculos u obstrucción urinaria',
    'Instrumentación urinaria reciente',
  ];

  const ListItem = ({ text }) => (
    <div className="flex items-start gap-2.5">
      <div className="pt-1.5">
        <div className="w-1.5 h-1.5 bg-teal-700 rounded-full shrink-0" />
      </div>
      <p className="text-slate-700 text-xs font-normal font-['Inter'] leading-5">{text}</p>
    </div>
  );

  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col justify-start items-start gap-6">
        <h2 className="text-teal-700 text-3xl font-semibold font-['Inter']">Por qué hacer seguimiento</h2>

        <p className="text-slate-700 text-sm font-normal font-['Inter'] leading-relaxed">
          La pielonefritis es una infección del riñón, generalmente por bacterias que ascienden desde la vejiga; <em>Escherichia coli</em> es la causa más frecuente, aunque no la única.
          <br /><br />
          Hacer seguimiento continuo permite registrar cuántas infecciones confirmadas ocurren en el año, reconocer factores de riesgo y detectar señales de alarma antes de que el cuadro se complique.
        </p>

        <h3 className="text-slate-900 text-2xl lg:text-3xl font-bold font-['Inter']">Cuándo se considera recurrencia</h3>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1 p-4 bg-teal-700 rounded-xl flex items-center gap-4">
            <span className="text-white text-4xl font-bold font-['Inter']">2+</span>
            <p className="text-teal-100 text-xs font-normal font-['Inter'] leading-tight">
              episodios sintomáticos confirmados en 6 meses
            </p>
          </div>
          <div className="flex-1 p-4 bg-teal-700 rounded-xl flex items-center gap-4">
            <span className="text-white text-4xl font-bold font-['Inter']">3+</span>
            <p className="text-teal-100 text-xs font-normal font-['Inter'] leading-tight">
              episodios sintomáticos confirmados en 12 meses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-2">
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-slate-900 text-base font-semibold font-['Inter']">Señales de alarma</h4>
            <div className="flex flex-col gap-2">
              <ListItem text="Fiebre ≥ 38 °C o escalofríos con temblor" />
              <ListItem text="Dolor nuevo o creciente en costado o espalda baja" />
              <ListItem text="Náuseas o vómitos que impiden beber líquidos o medicarse" />
              <ListItem text="Urgencias inmediatas: confusión nueva, desmayo o dificultad respiratoria" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-slate-900 text-base font-semibold font-['Inter']">Cómo se evalúa</h4>
            <div className="flex flex-col gap-2">
              <ListItem text="Valoración clínica y examen general de orina (el aspecto visual por sí solo no diagnostica)" />
              <ListItem text="Urocultivo con antibiograma en toda sospecha de pielonefritis para ajustar el tratamiento" />
              <ListItem text="Ecografía o tomografía según evolución clínica o sospecha de obstrucción" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
            <h4 className="text-slate-900 text-base font-semibold font-['Inter']">Por qué consultar a tiempo</h4>
            <div className="flex flex-col gap-2">
              <ListItem text="Mayor riesgo de complicación en diabetes, embarazo, obstrucción o inmunosupresión" />
              <ListItem text="Riesgo de compromiso de la función renal o absceso si no se trata oportunamente" />
              <ListItem text="En casos graves puede evolucionar a infección sanguínea (sepsis)" />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <h4 className="text-slate-900 text-sm font-semibold font-['Inter']">Condiciones que requieren mayor vigilancia</h4>
          <div className="flex flex-wrap gap-2">
            {poblaciones.map((pob, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-700 text-xs font-medium font-['Inter']">
                {pob}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-teal-900 text-xs font-medium">
            Revisa tus síntomas sin crear cuenta o activa tu seguimiento semanal gratuito con derivación profesional.
          </span>
          <a href="#autochequeo" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0">
            Hacer autochequeo gratis
          </a>
        </div>

        <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-snug">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}