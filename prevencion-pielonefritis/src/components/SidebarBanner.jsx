import React from 'react';

export default function SidebarBanner() {
  return (
    <aside className="w-full lg:w-[600px] min-h-screen p-12 lg:p-20 bg-[#0F766E] flex flex-col justify-between items-start shrink-0">
      {/* Branding */}
      <div className="flex justify-start items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-xl flex justify-center items-center shadow-sm">
          <span className="text-[#0F766E] text-2xl font-bold font-['Inter']">P</span>
        </div>
        <span className="text-white text-2xl font-bold font-['Inter']">
          CERO NEFRITIS
        </span>
      </div>

      {/* Copy Principal */}
      <div className="my-16 lg:my-0 flex flex-col justify-start items-start gap-6 max-w-lg">
        <h1 className="text-white text-4xl lg:text-5xl font-bold font-['Inter'] leading-[1.15]">
          Prevención y seguimiento, más cerca de cada paciente.
        </h1>
        <p className="text-[#CCFBF1] text-lg font-normal font-['Inter'] leading-relaxed">
          Conecta a pacientes y profesionales para detectar riesgos a tiempo, dar indicaciones claras y mantener la comunicación en un solo lugar.
        </p>
      </div>

      {/* Footer Nav */}
      <nav className="flex flex-wrap justify-start items-center gap-8">
        <a href="#inicio" className="text-white text-sm font-semibold font-['Inter'] underline underline-offset-4">
          Inicio
        </a>
        <a href="#mision" className="text-[#99F6E4] hover:text-white text-sm font-medium font-['Inter'] transition-colors">
          Misión
        </a>
        <a href="#vision" className="text-[#99F6E4] hover:text-white text-sm font-medium font-['Inter'] transition-colors">
          Visión
        </a>
        <a href="#por-que" className="text-[#99F6E4] hover:text-white text-sm font-medium font-['Inter'] transition-colors">
          Por qué hacer seguimiento
        </a>
      </nav>
    </aside>
  );
}