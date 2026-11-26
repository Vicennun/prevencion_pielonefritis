import React from 'react';

export default function Mision() {
  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col justify-start items-start gap-6">
        <div className="px-3 py-1 bg-teal-50 rounded-full border border-teal-200 inline-flex">
          <span className="text-teal-700 text-sm font-semibold font-['Inter']">Misión</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 p-5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-teal-700 text-xs font-semibold font-['Inter']">01</span>
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Prevenir</h3>
            <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-5">
              Orientar sobre hábitos validados: mantener hidratación individualizada según indicación médica, no retener la orina, higiene íntima suave sin duchas vaginales y control de diabetes. Orinar tras relaciones sexuales puede considerarse un hábito de bajo riesgo con evidencia limitada.
            </p>
          </div>
          <div className="flex-1 p-5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-teal-700 text-xs font-semibold font-['Inter']">02</span>
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Detectar</h3>
            <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-5">
              Registrar cada infección urinaria confirmada, los urocultivos y las condiciones de riesgo de cada persona para priorizar oportunamente a quien necesita valoración presencial.
            </p>
          </div>
          <div className="flex-1 p-5 bg-white rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-teal-700 text-xs font-semibold font-['Inter']">03</span>
            <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Acompañar</h3>
            <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-5">
              Facilitar la continuidad entre niveles de atención, apoyar la adherencia sin culpabilizar y activar derivación oportuna si aparecen señales de alarma.
            </p>
          </div>
        </div>

        <h2 className="text-slate-900 text-3xl font-bold font-['Inter'] leading-8 mt-4">
          Prevenir la pielonefritis con seguimiento continuo
        </h2>

        <p className="text-slate-700 text-sm font-normal font-['Inter'] leading-relaxed">
          La pielonefritis es una infección del riñón, generalmente por bacterias que ascienden desde la vejiga; <em>Escherichia coli</em> es la causa más frecuente, pero no la única. Cuando existen recurrencias o factores de riesgo, organizar el historial clínico y dar seguimiento continuo ayuda a consultar a tiempo.
        </p>

        <div className="w-full p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-teal-900 text-xs font-medium">
            Conoce gratis las señales de alarma o crea tu cuenta para seguimiento automático.
          </span>
          <a href="#prevencion-gratis" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0">
            Ver guía gratuita
          </a>
        </div>

        <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-snug mt-2">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}