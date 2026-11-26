import React, { useState, useEffect } from 'react';

// Componentes Públicos
import SidebarBanner from './components/SidebarBanner';
import RegisterForm from './components/RegisterForm';
import Mision from './components/Mision';
import Vision from './components/Vision';
import PorQue from './components/PorQue';
import PublicFreeGuide from './components/PublicFreeGuide';
import PublicAutochequeo from './components/PublicAutochequeo';
import AccessibilityBar from './components/AccessibilityBar';

// Componentes Paciente
import PatientSidebar from './components/PatientSidebar';
import PatientDashboard from './components/PatientDashboard';
import PatientMensajes from './components/PatientMensajes';
import PatientAtenciones from './components/PatientAtenciones';
import PatientFormulario from './components/PatientFormulario';
import PatientPrevencion from './components/PatientPrevencion';
import PatientRecordatorios from './components/PatientRecordatorios';
import PatientTratamientoActivo from './components/PatientTratamientoActivo';
import PatientExamenes from './components/PatientExamenes';

// Componentes Profesional
import ProSidebar from './components/ProSidebar';
import ProDashboard from './components/ProDashboard';
import ProHistorial from './components/ProHistorial';
import ProDetalleAtencion from './components/ProDetalleAtencion';
import ProPacientes from './components/ProPacientes';
import ProDetallePaciente from './components/ProDetallePaciente';
import ProMensajes from './components/ProMensajes';
import ProPrevenciones from './components/ProPrevenciones';
import ProRecordatorios from './components/ProRecordatorios';
import ProSeguimientoActivo from './components/ProSeguimientoActivo';
import ProRevisionExamen from './components/ProRevisionExamen';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos de inactividad
const PRO_ROLES = ['PROFESIONAL', 'ADMIN', 'DESARROLLADOR'];

function getValidSession() {
  try {
    const raw = localStorage.getItem('ceroNefritisUser');
    if (!raw) {
      localStorage.removeItem('ceroNefritisLastActive');
      return null;
    }

    const user = JSON.parse(raw);
    if (!user?.id || !user?.rol) {
      localStorage.removeItem('ceroNefritisUser');
      localStorage.removeItem('ceroNefritisLastActive');
      return null;
    }

    const lastActive = Number(localStorage.getItem('ceroNefritisLastActive') || 0);
    if (lastActive && Date.now() - lastActive > SESSION_TIMEOUT_MS) {
      localStorage.removeItem('ceroNefritisUser');
      localStorage.removeItem('ceroNefritisLastActive');
      return null;
    }

    if (!lastActive) {
      localStorage.setItem('ceroNefritisLastActive', String(Date.now()));
    }

    return user;
  } catch {
    localStorage.removeItem('ceroNefritisUser');
    localStorage.removeItem('ceroNefritisLastActive');
    return null;
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#inicio');
  const [authNotice, setAuthNotice] = useState('');

  // Escucha cambios en el hash
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#inicio');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Renueva actividad de sesión y expira automáticamente tras 30 min sin uso
  useEffect(() => {
    const touchActivity = () => {
      if (localStorage.getItem('ceroNefritisUser')) {
        localStorage.setItem('ceroNefritisLastActive', String(Date.now()));
      }
    };

    window.addEventListener('click', touchActivity);
    window.addEventListener('keydown', touchActivity);

    const timer = setInterval(() => {
      const raw = localStorage.getItem('ceroNefritisUser');
      const lastActive = Number(localStorage.getItem('ceroNefritisLastActive') || 0);
      if (raw && lastActive && Date.now() - lastActive > SESSION_TIMEOUT_MS) {
        localStorage.removeItem('ceroNefritisUser');
        localStorage.removeItem('ceroNefritisLastActive');
        setAuthNotice('Tu sesión expiró por inactividad. Inicia sesión nuevamente.');
        window.location.hash = '#inicio';
      }
    }, 60 * 1000);

    return () => {
      window.removeEventListener('click', touchActivity);
      window.removeEventListener('keydown', touchActivity);
      clearInterval(timer);
    };
  }, []);

  // Parseo tolerante a barras iniciales/finales (#/zona/seccion/id)
  const cleanHash = (currentPath || '#inicio').replace(/^#\/?/, '').split('?')[0];
  const [root = 'inicio', section = '', rawId = ''] = cleanHash.split('/').filter(Boolean);
  const routeId = rawId && !Number.isNaN(Number(rawId)) ? Number(rawId) : null;

  const sessionUser = getValidSession();
  const isPacienteRoute = root === 'paciente';
  const isProRoute = root === 'profesional';

  // Determinar si corresponde bloquear/redirigir
  let redirectTarget = null;
  let noticeMsg = '';

  if (isPacienteRoute || isProRoute) {
    if (!sessionUser) {
      redirectTarget = '#inicio';
      noticeMsg = 'Debes iniciar sesión para acceder a esa sección.';
    } else if (isPacienteRoute && sessionUser.rol !== 'PACIENTE') {
      redirectTarget = '#profesional';
    } else if (isProRoute && !PRO_ROLES.includes(sessionUser.rol)) {
      redirectTarget = '#paciente';
    }
  }

  useEffect(() => {
    if (redirectTarget) {
      if (noticeMsg) setAuthNotice(noticeMsg);
      window.location.hash = redirectTarget;
    } else if (isPacienteRoute || isProRoute) {
      setAuthNotice('');
    }
  }, [redirectTarget, noticeMsg, isPacienteRoute, isProRoute]);

  // Evita renderizar contenido protegido mientras redirige
  if (redirectTarget) {
    return null;
  }

  // ==========================================
  // 1. ZONA PRIVADA (PACIENTE — PROTEGIDA)
  // ==========================================
  if (isPacienteRoute) {
    let patientContent;
    let activeTab = 'inicio';

    switch (section) {
      case 'mensajes':
        patientContent = <PatientMensajes />;
        activeTab = 'mensajes';
        break;
      case 'atenciones':
        patientContent = <PatientAtenciones />;
        activeTab = 'atenciones';
        break;
      case 'formulario':
        patientContent = <PatientFormulario />;
        activeTab = 'formulario';
        break;
      case 'prevencion':
        patientContent = <PatientPrevencion />;
        activeTab = 'prevencion';
        break;
      case 'recordatorios':
        patientContent = <PatientRecordatorios />;
        activeTab = 'recordatorios';
        break;
      case 'tratamiento-activo':
        patientContent = <PatientTratamientoActivo />;
        activeTab = 'tratamiento-activo';
        break;
      case 'examenes':
        patientContent = <PatientExamenes />;
        activeTab = 'examenes';
        break;
      default:
        patientContent = <PatientDashboard />;
        activeTab = 'inicio';
        break;
    }

    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-100">
        <PatientSidebar activeTab={activeTab} />
        {patientContent}
        <AccessibilityBar />
      </div>
    );
  }

  // ==========================================
  // 2. ZONA PRIVADA (PROFESIONAL — PROTEGIDA)
  // ==========================================
  if (isProRoute) {
    let proContent;
    let activeTab = 'inicio';

    switch (section) {
      case 'historial':
        proContent = <ProHistorial />;
        activeTab = 'historial';
        break;
      case 'detalle-atencion':
        proContent = <ProDetalleAtencion key={routeId ?? 'at-default'} atencionId={routeId} />;
        activeTab = 'historial';
        break;
      case 'pacientes':
        proContent = <ProPacientes />;
        activeTab = 'pacientes';
        break;
      case 'detalle-paciente':
        proContent = <ProDetallePaciente key={routeId ?? 'pac-default'} pacienteId={routeId} />;
        activeTab = 'pacientes';
        break;
      case 'mensajes':
        proContent = <ProMensajes key={routeId ?? 'msg-default'} pacienteInicialId={routeId} />;
        activeTab = 'mensajes';
        break;
      case 'prevenciones':
        proContent = <ProPrevenciones />;
        activeTab = 'prevenciones';
        break;
      case 'recordatorios':
        proContent = <ProRecordatorios />;
        activeTab = 'recordatorios';
        break;
      case 'seguimiento-activo':
        proContent = <ProSeguimientoActivo key={routeId ?? 'seg-default'} pacienteInicialId={routeId} />;
        activeTab = 'seguimiento-activo';
        break;
      case 'revision-examen':
        proContent = <ProRevisionExamen key={routeId ?? 'ex-default'} examenId={routeId} />;
        activeTab = 'seguimiento-activo';
        break;
      default:
        proContent = <ProDashboard />;
        activeTab = 'inicio';
        break;
    }

    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-200">
        <ProSidebar activeTab={activeTab} />
        {proContent}
        <AccessibilityBar />
      </div>
    );
  }

  // ==========================================
  // 3. ZONA PÚBLICA (ACCESO LIBRE / LOGIN / REGISTRO)
  // ==========================================
  let content;
  let sidebarProps = {};

  switch (root) {
    case 'prevencion-gratis':
      content = <PublicFreeGuide />;
      sidebarProps = {
        activeTab: 'prevencion-gratis',
        title: 'Información clara y gratuita para cuidar tus riñones.',
        description: 'Revisa pautas validadas de prevención y aprende cuándo pedir atención presencial sin necesidad de crear cuenta.',
      };
      break;
    case 'autochequeo':
      content = <PublicAutochequeo />;
      sidebarProps = {
        activeTab: 'autochequeo',
        title: 'Orientación rápida basada en señales clínicas.',
        description: 'Verifica tus síntomas hoy. Si necesitas seguimiento continuo o derivación a un profesional, crea tu cuenta gratis.',
      };
      break;
    case 'mision':
      content = <Mision />;
      sidebarProps = {
        activeTab: 'mision',
        title: 'Detectar a tiempo lo que empieza como una infección simple.',
        description: 'Acompañamos a pacientes y profesionales para que una infección urinaria no avance hasta convertirse en complicación mayor.',
      };
      break;
    case 'vision':
      content = <Vision />;
      sidebarProps = {
        activeTab: 'vision',
        title: 'Actuar antes de que la infección alcance el riñón.',
        description: 'Una plataforma donde cada paciente de riesgo tiene su historial, sus alertas y a su equipo de salud al alcance.',
      };
      break;
    case 'por-que':
      content = <PorQue />;
      sidebarProps = {
        activeTab: 'por-que',
        title: 'Organizar un historial permite anticipar el riesgo.',
        description: 'La atención suele llegar cuando ya hay síntomas. El seguimiento preventivo controla y mitiga ese momento.',
      };
      break;
    default:
      content = (
        <main className="flex-1 bg-neutral-100 min-h-screen flex flex-col justify-center items-center p-8 gap-4">
          {authNotice && (
            <div
              role="alert"
              className="w-full max-w-md px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-semibold text-center"
            >
              {authNotice}
            </div>
          )}
          <RegisterForm />
        </main>
      );
      sidebarProps = {
        activeTab: 'inicio',
        title: 'Prevención y seguimiento, más cerca de cada paciente.',
        description: 'Conecta a pacientes y profesionales para detectar riesgos a tiempo, dar indicaciones claras y mantener la comunicación en un solo lugar.',
      };
      break;
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-100">
      <SidebarBanner {...sidebarProps} />
      {content}
      <AccessibilityBar />
    </div>
  );
}