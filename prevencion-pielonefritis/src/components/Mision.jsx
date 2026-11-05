import React from 'react';

export default function Mision() {
  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col justify-start items-start gap-6">
        
        <div className="px-3 py-1 bg-teal-50 rounded-full border border-teal-200 inline-flex">
          <span className="text-teal-700 text-sm font-semibold font-['Inter']">Misión</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Tarjeta 1 */}
          <div className="flex-1 p-5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-teal-700 text-xs font-semibold font-['Inter']">01</span>
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Prevenir</h3>
            <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-5">
              Orientar sobre hábitos que reducen el riesgo: tomar suficiente agua, orinar con frecuencia, no aguantar la micción, ir al baño tras las relaciones sexuales y mantener buena higiene íntima.
            </p>
          </div>
          {/* Tarjeta 2 */}
          <div className="flex-1 p-5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-teal-700 text-xs font-semibold font-['Inter']">02</span>
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Detectar</h3>
            <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-5">
              Registrar cada infección urinaria confirmada y cruzarla con los factores de riesgo de cada persona, para identificar antes a quién necesita atención.
            </p>
          </div>
          {/* Tarjeta 3 */}
          <div className="flex-1 p-5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-teal-700 text-xs font-semibold font-['Inter']">03</span>
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Acompañar</h3>
            <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-5">
              Dar indicaciones claras y mantener la comunicación entre paciente y profesional en un solo lugar, con la historia clínica a mano.
            </p>
          </div>
        </div>

        <h2 className="text-slate-900 text-3xl font-bold font-['Inter'] leading-8 mt-4">
          Prevenir la pielonefritis con seguimiento continuo
        </h2>
        
        <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-relaxed">
          La pielonefritis es una infección grave del riñón que acostumbra a comenzar como una infección de la vejiga (o tracto urinario) que asciende hasta los riñones. Es una de las complicaciones más graves de estas infecciones, y es más probable cuando se repiten y descuidan factores de riesgo.
          <br /><br />
          Prevenir y detectar a tiempo es una de las misiones claves de nuestra web.
        </p>

        <p className="text-slate-400 text-xs font-normal font-['Inter'] leading-snug mt-2">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}