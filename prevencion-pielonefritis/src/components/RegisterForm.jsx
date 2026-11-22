import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import InputField from './InputField';
import { api } from '../services/api';

export default function RegisterForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('paciente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    if (error) setError('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleMode = () => {
    setIsLogin((prev) => !prev);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuario = isLogin
        ? await api.login({
            email: formData.email,
            password: formData.password,
          })
        : await api.registrar({
            nombreCompleto: formData.fullName,
            email: formData.email,
            password: formData.password,
            rol: role.toUpperCase(), // PACIENTE, PROFESIONAL, ADMINISTRADOR, DESARROLLADOR
          });

      localStorage.setItem('ceroNefritisUser', JSON.stringify(usuario));

      window.location.hash =
        usuario.rol === 'PROFESIONAL' ? '#profesional' : '#paciente';
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-white flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-center items-center gap-6">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-96 flex flex-col justify-start items-start gap-5"
        >
          {/* Encabezado */}
          <div className="w-full flex flex-col justify-start items-start gap-1.5">
            <h2 className="text-[#0F172A] text-3xl font-bold font-['Inter']">
              {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
            </h2>
            <p className="text-[#64748B] text-sm font-normal font-['Inter']">
              {isLogin
                ? 'Ingresa tus credenciales para continuar'
                : 'Elige cómo vas a usar la plataforma'}
            </p>
          </div>

          {/* Selector de Roles (solo en registro) */}
          {!isLogin && (
            <RoleSelector selectedRole={role} onSelectRole={setRole} />
          )}

          {/* Campos */}
          {!isLogin && (
            <InputField
              label="Nombre completo"
              placeholder="Ej. Camila Soto"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          )}

          <InputField
            label="Correo electrónico"
            type="email"
            placeholder="nombre@correo.cl"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />

          <InputField
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />

          {/* Mensaje de error */}
          {error && (
            <div
              role="alert"
              className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium font-['Inter']"
            >
              {error}
            </div>
          )}

          {/* Botón principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 text-white text-sm font-semibold font-['Inter'] rounded-[10px] transition-colors shadow-sm cursor-pointer"
          >
            {loading
              ? 'Procesando...'
              : isLogin
                ? 'Entrar a la plataforma'
                : 'Crear cuenta'}
          </button>

          {/* Alternar Login / Registro */}
          <div className="w-full flex justify-center items-center gap-1.5 pt-1">
            <span className="text-[#64748B] text-sm font-normal font-['Inter']">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </span>
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-[#0F766E] hover:underline text-sm font-semibold font-['Inter'] cursor-pointer"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
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