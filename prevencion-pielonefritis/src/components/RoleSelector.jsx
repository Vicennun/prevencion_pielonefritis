import React from 'react';

const roles = [
  { id: 'paciente', title: 'Paciente', desc: 'Controla tus atenciones y mensajes' },
  { id: 'profesional', title: 'Profesional', desc: 'Gestiona a tus pacientes' },
  { id: 'administrador', title: 'Administrador', desc: 'Administra la plataforma' },
  { id: 'desarrollador', title: 'Desarrollador', desc: 'Mantén y evoluciona el sistema' },
];

export default function RoleSelector({ selectedRole, onSelectRole }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelectRole(role.id)}
            className={`px-4 py-3.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-start items-start gap-1 ${
              isSelected
                ? 'bg-teal-50 outline outline-2 outline-offset-[-2px] outline-teal-700'
                : 'bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 hover:border-slate-300'
            }`}
          >
            <span
              className={`text-base font-semibold font-['Inter'] ${
                isSelected ? 'text-teal-800' : 'text-slate-900'
              }`}
            >
              {role.title}
            </span>
            <span className="text-slate-500 text-xs font-normal font-['Inter']">
              {role.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}