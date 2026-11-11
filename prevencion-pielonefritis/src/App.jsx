import React, { useState, useEffect } from 'react';

// Componentes Públicos
import SidebarBanner from './components/SidebarBanner';
import RegisterForm from './components/RegisterForm';
import Mision from './components/Mision';
import Vision from './components/Vision';
import PorQue from './components/PorQue';

// Componentes Paciente
import PatientSidebar from './components/PatientSidebar';
import PatientDashboard from './components/PatientDashboard';
import PatientMensajes from './components/PatientMensajes';
import PatientAtenciones from './components/PatientAtenciones';
import PatientFormulario from './components/PatientFormulario';
import PatientPrevencion from './components/PatientPrevencion';
import PatientRecordatorios from './components/PatientRecordatorios';
import PatientTratamientoActivo from './components/PatientTratamientoActivo'; // <-- Arriba
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

export default function App() {
  // Leemos el hash actual de la URL o por defecto cargamos '#inicio'
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#inicio');

  // Escuchamos los cambios en la URL cuando el usuario hace clic en el Sidebar o navega
  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ==========================================
  // 1. ZONA PRIVADA (PACIENTE)
  // ==========================================
  // Si el usuario entra a cualquier ruta que empiece con '#paciente'
  if (currentPath.startsWith('#paciente')) {
    let patientContent;
    let activeTab = 'inicio';

    // Sub-rutas del dashboard del paciente
    switch (currentPath) {
      case '#paciente/mensajes':
        patientContent = <PatientMensajes />;
        activeTab = 'mensajes';
        break;
      case '#paciente/atenciones':
        patientContent = <PatientAtenciones />;
        activeTab = 'atenciones';
        break;
      case '#paciente/formulario':
        patientContent = <PatientFormulario />;
        activeTab = 'formulario';
        break;
      case '#paciente/prevencion':
        patientContent = <PatientPrevencion />;
        activeTab = 'prevencion';
        break;
      case '#paciente/recordatorios':
        patientContent = <PatientRecordatorios />;
        activeTab = 'recordatorios';
        break;
      case '#paciente/tratamiento-activo':
        patientContent = <PatientTratamientoActivo />;
        activeTab = 'tratamiento-activo';
        break;
      case '#paciente/examenes':
        patientContent = <PatientExamenes />;
        activeTab = 'examenes';
        break;
      case '#paciente':
      default:
        patientContent = <PatientDashboard />;
        activeTab = 'inicio';
        break;
    }

    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-100">
        <PatientSidebar activeTab={activeTab} />
        {patientContent}
      </div>
    );
  }

  // ==========================================
  // 2. ZONA PRIVADA (PROFESIONAL / MÉDICO)
  // ==========================================
  // Si el usuario entra a cualquier ruta que empiece con '#profesional'
  if (currentPath.startsWith('#profesional')) {
    let proContent;
    let activeTab = 'inicio';

    // Sub-rutas del dashboard del profesional (se irán agregando más)
    switch (currentPath) {
      case '#profesional/historial':           // <-- Agregamos esta ruta
        proContent = <ProHistorial />;
        activeTab = 'historial';
        break;
      case '#profesional/detalle-atencion':    // <-- Nueva ruta
        proContent = <ProDetalleAtencion />;
        activeTab = 'historial';               // <-- Mantenemos 'historial' encendido en el sidebar
        break;
      case '#profesional/pacientes':           // <-- Nueva ruta
        proContent = <ProPacientes />;
        activeTab = 'pacientes';
        break;
      case '#profesional/detalle-paciente':    // <-- Nueva ruta
        proContent = <ProDetallePaciente />;
        activeTab = 'pacientes';               // <-- Mantén la pestaña encendida
        break;
      case '#profesional/mensajes':            // <-- Nueva ruta
        proContent = <ProMensajes />;
        activeTab = 'mensajes';
        break;
      case '#profesional/prevenciones':        // <-- Nueva ruta
        proContent = <ProPrevenciones />;
        activeTab = 'prevenciones';
        break;
      case '#profesional/recordatorios':       // <-- ÚLTIMA RUTA!
        proContent = <ProRecordatorios />;
        activeTab = 'recordatorios';
        break;
      case '#profesional/seguimiento-activo':   // <-- NUEVA RUTA
        proContent = <ProSeguimientoActivo />;
        activeTab = 'seguimiento-activo';               // <-- Mantiene el sidebar en pacientes
        break;
      case '#profesional/revision-examen':
        proContent = <ProRevisionExamen />;
        activeTab = 'seguimiento-activo'; // Mantiene iluminado el menú actual
        break;
      case '#profesional':
      default:
        proContent = <ProDashboard />;
        activeTab = 'inicio';
        break;
    }

    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-200">
        <ProSidebar activeTab={activeTab} />
        {proContent}
      </div>
    );
  }

  // ==========================================
  // 3. ZONA PÚBLICA (LANDING / REGISTRO)
  // ==========================================
  let content;
  let sidebarProps = {};

  switch (currentPath) {
    case '#mision':
      content = <Mision />;
      sidebarProps = {
        activeTab: 'mision',
        title: 'Detectar a tiempo lo que empieza como una infección simple.',
        description: 'Acompañamos a pacientes y profesionales para que una infección urinaria no avance hasta convertirse en complicación mayor.'
      };
      break;
    case '#vision':
      content = <Vision />;
      sidebarProps = {
        activeTab: 'vision',
        title: 'Actuar antes de que la infección alcance el riñón.',
        description: 'Una plataforma donde cada paciente de riesgo tiene su historial, sus alertas y a su equipo de salud al alcance.'
      };
      break;
    case '#por-que':
      content = <PorQue />;
      sidebarProps = {
        activeTab: 'por-que',
        title: 'Organizar un historial permite anticipar el riesgo.',
        description: 'La atención suele llegar cuando ya hay síntomas. El seguimiento preventivo controla y mitiga ese momento.'
      };
      break;
    case '#inicio':
    default:
      // Dejamos el RegisterForm envolviéndolo en un main para mantener la estructura flex
      content = (
        <main className="flex-1 bg-neutral-100 min-h-screen flex flex-col justify-center items-center p-8">
          <RegisterForm />
        </main>
      );
      sidebarProps = {
        activeTab: 'inicio',
        title: 'Prevención y seguimiento, más cerca de cada paciente.',
        description: 'Conecta a pacientes y profesionales para detectar riesgos a tiempo, dar indicaciones claras y mantener la comunicación en un solo lugar.'
      };
      break;
  }

  // Retorno del layout público por defecto
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-100">
      <SidebarBanner {...sidebarProps} />
      {content}
    </div>
  );
}