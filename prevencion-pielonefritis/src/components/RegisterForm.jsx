import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import InputField from './InputField';

const DEMO_USERS = [
  {
    name: 'Camila Soto',
    role: 'paciente',
    email: 'camila.soto@salud.cl',
    password: 'Camila2026!',
    hash: '#paciente',
  },
  {
    name: 'Freddy Turbina',
    role: 'profesional',
    email: 'freddy.turbina@salud.cl',
    password: 'Freddy2026!',
    hash: '#profesional',
  },
];

export default function RegisterForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('paciente');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Expresión regular estándar para validar formato de correo
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = formData.fullName.trim();
    const cleanEmail = formData.email.trim().toLowerCase();
    const password = formData.password;

    // 1. Validar nombre completo (solo en modo registro)
    if (!isLogin && cleanName.length < 3) {
      setErrorMsg('Por favor ingresa tu nombre completo (mínimo 3 caracteres).');
      return;
    }

    // 2. Validar correo vacío o con mal formato
    if (!cleanEmail) {
      setErrorMsg('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('El formato del correo no es válido (ej. nombre@correo.cl).');
      return;
    }

    // 3. Validar contraseña vacía o corta
    if (!password) {
      setErrorMsg('Por favor ingresa tu contraseña.');
      return;
    }
    if (!isLogin && password.length < 8) {
      setErrorMsg('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // 4. Lógica de INICIO DE SESIÓN con credenciales locales
    if (isLogin) {
      const foundUser = DEMO_USERS.find((u) => u.email === cleanEmail);

      // Correo no existe en los usuarios de prueba
      if (!foundUser) {
        setErrorMsg('No existe una cuenta registrada con este correo electrónico.');
        return;
      }

      // Correo existe, pero el rol seleccionado arriba no coincide
      if (foundUser.role !== role) {
        const perfilCorrecto = foundUser.role === 'profesional' ? 'Profesional' : 'Paciente';
        setErrorMsg(
          `Este correo pertenece a una cuenta de ${perfilCorrecto}. Cambia el perfil arriba para ingresar.`
        );
        return;
      }

      // Correo y rol coinciden, pero la contraseña falla
      if (foundUser.password !== password) {
        setErrorMsg('Contraseña incorrecta. Verifica mayúsculas, minúsculas y símbolos.');
        return;
      }

      // Todo correcto -> Redirección
      window.location.hash = foundUser.hash;
      return;
    }

    // 5. Lógica de CREAR CUENTA (redirección local según rol)
    window.location.hash = role === 'profesional' ? '#profesional' : '#paciente';
  };

  const handleInputChange = (field, value) => {
    if (errorMsg) setErrorMsg(''); // Limpia el error apenas el usuario vuelve a escribir
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setErrorMsg('');
    setIsLogin((prev) => !prev);
  };

  const handleRoleChange = (nextRole) => {
    setErrorMsg('');
    setRole(nextRole);
  };

  return (
    <main className="flex-1 bg-white flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-center items-center gap-6">
        {/* noValidate evita el globo nativo feo del navegador para mostrar siempre nuestros mensajes */}
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
                ? 'Ingresa tus credenciales para acceder a tu panel'
                : 'Elige cómo vas a usar la plataforma'}
            </p>
          </div>

          {/* Selector de Roles */}
          <RoleSelector selectedRole={role} onSelectRole={handleRoleChange} />

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

          {/* Caja de mensaje de error */}
          {errorMsg && (
            <div
              role="alert"
              className="w-full text-red-700 text-xs font-medium font-['Inter'] bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 leading-relaxed"
            >
              {errorMsg}
            </div>
          )}

          {/* Botón principal */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold font-['Inter'] rounded-[10px] transition-colors shadow-sm cursor-pointer"
          >
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>

          {/* Enlace alternar Registro / Login */}
          <div className="w-full flex justify-center items-center gap-1.5 pt-1">
            <span className="text-[#64748B] text-sm font-normal font-['Inter']">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#0F766E] hover:underline text-sm font-semibold font-['Inter'] cursor-pointer"
            >
              {isLogin ? 'Crea una aquí' : 'Inicia sesión'}
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