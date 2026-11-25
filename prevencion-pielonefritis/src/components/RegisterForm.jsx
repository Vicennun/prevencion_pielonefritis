import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import InputField from './InputField';
import { api } from '../services/api';

const ROLE_TO_DB = {
  paciente: 'PACIENTE',
  profesional: 'PROFESIONAL',
  administrador: 'ADMIN',
  desarrollador: 'DESARROLLADOR',
};

const DB_TO_LABEL = {
  PACIENTE: 'Paciente',
  PROFESIONAL: 'Profesional',
  ADMIN: 'Administrador',
  DESARROLLADOR: 'Desarrollador',
};

export default function RegisterForm() {
  const [isLogin, setIsLogin] = useState(false); // Arranca en "Crear cuenta" como la versión original
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

  const handleModeChange = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Ingresa tu correo electrónico y contraseña.');
      return;
    }
    if (!isLogin && !formData.fullName.trim()) {
      setError('Ingresa tu nombre completo para crear la cuenta.');
      return;
    }
    if (!isLogin && formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const rolEsperado = ROLE_TO_DB[role] || 'PACIENTE';
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
            rol: rolEsperado,
          });

      // En login, valida que la cuenta pertenezca al rol seleccionado
      if (isLogin && usuario.rol !== rolEsperado) {
        setError(
          `Esta cuenta corresponde al rol "${DB_TO_LABEL[usuario.rol] || usuario.rol}". Selecciona ese rol arriba para ingresar.`
        );
        return;
      }

      localStorage.setItem('ceroNefritisUser', JSON.stringify(usuario));

      window.location.hash =
        usuario.rol === 'PACIENTE' ? '#paciente' : '#profesional';
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
          className="w-full flex flex-col justify-start items-start gap-5"
        >
          {/* Pestañas claras: Crear cuenta / Iniciar sesión */}
          <div className="w-full p-1 bg-slate-100 rounded-xl grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleModeChange(false)}
              className={`py-2.5 text-sm font-semibold font-['Inter'] rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(true)}
              className={`py-2.5 text-sm font-semibold font-['Inter'] rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Iniciar sesión
            </button>
          </div>

          {/* Encabezado */}
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <h2 className="text-[#0F172A] text-3xl font-bold font-['Inter']">
              {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
            </h2>
            <p className="text-[#64748B] text-sm font-normal font-['Inter']">
              {isLogin
                ? 'Selecciona tu perfil e ingresa tus credenciales'
                : 'Elige tu rol y completa tus datos para registrarte'}
            </p>
          </div>

          {/* Selector de Roles visible en ambos modos */}
          <RoleSelector selectedRole={role} onSelectRole={handleRoleSelect} />

          {/* Nombre completo (solo en registro) */}
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

          {error && (
            <div
              role="alert"
              className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium font-['Inter']"
            >
              {error}
            </div>
          )}

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

          <div className="w-full flex justify-center items-center gap-1.5 pt-1">
            <span className="text-[#64748B] text-sm font-normal font-['Inter']">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </span>
            <button
              type="button"
              onClick={() => handleModeChange(!isLogin)}
              className="text-[#0F766E] hover:underline text-sm font-semibold font-['Inter'] cursor-pointer"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>
        </form>

        <p className="w-full max-w-[420px] text-center text-slate-500 text-xs sm:text-sm font-normal font-['Inter'] leading-relaxed pt-2">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos, no prescribe tratamientos y bajo ningún caso reemplaza la evaluación de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}