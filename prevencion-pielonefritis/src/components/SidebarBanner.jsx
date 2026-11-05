import React from 'react';

export default function SidebarBanner({ title, description, activeTab }) {
  const navLinks = [
    { id: 'inicio', label: 'Inicio', href: '#inicio' },
    { id: 'mision', label: 'Misión', href: '#mision' },
    { id: 'vision', label: 'Visión', href: '#vision' },
    { id: 'por-que', label: 'Por qué hacer seguimiento', href: '#por-que' },
  ];

  return (
    <aside className="w-full lg:w-[40%] xl:w-[560px] min-h-screen p-10 lg:p-16 bg-teal-700 flex flex-col justify-between items-start shrink-0">
      {/* Branding */}
      <div className="flex justify-start items-center gap-3">
        <div className="w-11 h-11 bg-white rounded-xl flex justify-center items-center shadow-sm">
          <span className="text-teal-700 text-xl font-bold font-['Inter']">S</span>
        </div>
        <span className="text-white text-xl font-bold font-['Inter']">
          Seguimiento Salud
        </span>
      </div>

      {/* Copy Principal Dinámico */}
      <div className="my-12 lg:my-0 flex flex-col justify-start items-start gap-4 max-w-lg">
        <h1 className="text-white text-4xl font-bold font-['Inter'] leading-[47px]">
          {title}
        </h1>
        <p className="text-teal-100 text-base font-normal font-['Inter']">
          {description}
        </p>
      </div>

      {/* Footer Nav */}
      <nav className="flex flex-wrap justify-start items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={`text-xs font-['Inter'] transition-colors ${
              activeTab === link.id
                ? "text-white font-semibold underline underline-offset-4"
                : "text-teal-200 font-medium hover:text-white"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}