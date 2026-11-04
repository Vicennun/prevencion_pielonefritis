import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import InputField from './InputField';

export default function RegisterForm() {
  const [role, setRole] = useState('paciente');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', { ...formData, role });
  };

  return (
    <main className="flex-1 bg-white flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-center items-center gap-6">
        <form onSubmit={handleSubmit} className="w-96 flex flex-col justify-start items-start gap-5">
          {/* Encabezado */}
          <div className="w-full flex flex-col justify-start items-start gap-1.5">
            <h2 className="text-[#0F172A] text-3xl font-bold font-['Inter']">
              Crea tu cuenta
            </h2>
            <p className="text-[#64748B] text-sm font-normal font-['Inter']">
              Elige cómo vas a usar la plataforma
            </p>
          </div>

          {/* Selector de Roles */}
          <RoleSelector selectedRole={role} onSelectRole={setRole} />

          {/* Campos */}
          <InputField
            label="Nombre completo"
            placeholder="Ej. Camila Soto"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <InputField
            label="Correo electrónico"
            type="email"
            placeholder="nombre@correo.cl"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <InputField
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {/* Botón */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold font-['Inter'] rounded-[10px] transition-colors shadow-sm cursor-pointer"
          >
            Crear cuenta
          </button>

          {/* Enlace Login */}
          <div className="w-full flex justify-center items-center gap-1.5 pt-1">
            <span className="text-[#64748B] text-sm font-normal font-['Inter']">
              ¿Ya tienes cuenta?
            </span>
            <button
              type="button"
              className="text-[#0F766E] hover:underline text-sm font-semibold font-['Inter'] cursor-pointer"
            >
              Inicia sesión
            </button>
          </div>
        </form>

        {/* Disclaimer médico */}
        <p className="w-full max-w-[420px] text-center text-slate-500 text-xs sm:text-sm font-normal font-['Inter'] leading-relaxed pt-2">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}