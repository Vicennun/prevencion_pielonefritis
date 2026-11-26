import React from 'react';

export default function SidebarBanner({ title, description, activeTab }) {
  const navLinks = [
    { id: 'inicio', label: 'Ingresar / Cuenta', href: '#inicio' },
    { id: 'prevencion-gratis', label: 'Prevención gratis', href: '#prevencion-gratis' },
    { id: 'autochequeo', label: 'Autochequeo gratis', href: '#autochequeo' },
    { id: 'mision', label: 'Misión', href: '#mision' },
    { id: 'vision', label: 'Visión', href: '#vision' },
    { id: 'por-que', label: 'Por qué seguirse', href: '#por-que' },
  ];

  return (
    <aside className="w-full lg:w-[40%] xl:w-[540px] lg:min-h-screen p-8 lg:p-14 bg-teal-800 flex flex-col justify-between items-start gap-8 shrink-0">
      {/* Branding unificado */}
      <a href="#inicio" className="flex justify-start items-center gap-3">
        <div className="w-11 h-11 bg-white rounded-xl flex justify-center items-center shadow-sm">
          <span className="text-teal-800 text-xl font-bold font-['Inter']">N</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-xl font-bold font-['Inter'] leading-tight">CERO - NEFRITIS</span>
          <span className="text-teal-200 text-xs font-medium">Prevención y seguimiento gratuito</span>
        </div>
      </a>

      {/* Copy + Flujo de 3 pasos claros */}
      <div className="flex flex-col justify-start items-start gap-5 max-w-lg">
        <h1 className="text-white text-3xl lg:text-4xl font-bold font-['Inter'] leading-tight">
          {title}
        </h1>
        <p className="text-teal-100 text-sm lg:text-base font-normal font-['Inter'] leading-relaxed">
          {description}
        </p>

        {/* Cómo funciona (siempre claro para el paciente) */}
        <div className="w-full p-4 bg-teal-900/50 border border-teal-600/60 rounded-2xl flex flex-col gap-2.5">
          <span className="text-teal-200 text-xs font-bold uppercase tracking-wide">
            ¿Cómo funciona gratis?
          </span>
          <div className="flex flex-col gap-2 text-xs text-white">
            <p><strong>1. Infórmate sin cuenta:</strong> accede libremente a guías preventivas y señales de alarma.</p>
            <p><strong>2. Seguimiento automático:</strong> registra tus síntomas semanales o diarios con semáforo clínico.</p>
            <p><strong>3. Derivación oportuna:</strong> si aparece una alerta roja o urgencia, avisamos al profesional.</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="#prevencion-gratis"
              className="px-3.5 py-2 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold transition-colors"
            >
              Ver guía gratuita
            </a>
            <a
              href="#autochequeo"
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 border border-teal-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Hacer autochequeo rápido
            </a>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <nav aria-label="Navegación pública" className="flex flex-wrap justify-start items-center gap-x-5 gap-y-2.5">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={`text-xs font-['Inter'] transition-colors ${
              activeTab === link.id
                ? 'text-white font-bold underline underline-offset-4'
                : 'text-teal-200 font-medium hover:text-white'
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}