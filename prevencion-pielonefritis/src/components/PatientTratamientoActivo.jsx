import React, { useState } from 'react';
import NotificationsMenu from './NotificationsMenu';

export default function PatientTratamientoActivo() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estado para simular si el paciente ya llenó su reporte de hoy
  const [sintomasRegistrados, setSintomasRegistrados] = useState(false);

  // Datos mockeados del tratamiento activo
  const tratamiento = {
    diagnostico: 'Pielonefritis Aguda',
    medico: 'Dra. Valentina Rojas',
    diaActual: 3,
    totalDias: 7,
    medicamentos: [
      { id: 1, nombre: 'Ciprofloxacino 500mg', indicacion: '1 comprimido cada 12 horas', proxima: 'Hoy · 20:00 hrs', estado: 'Pendiente' },
      { id: 2, nombre: 'Paracetamol 1g', indicacion: 'En caso de fiebre o dolor sobre 5', proxima: 'SOS', estado: 'Opcional' }
    ],
    examenes: [
      { nombre: 'Urocultivo de control', estado: 'Muestra en laboratorio', fecha: 'Resultado en 24-48h' }
    ]
  };

  const progresoPorcentaje = Math.round((tratamiento.diaActual / tratamiento.totalDias) * 100);

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded uppercase">
              TRATAMIENTO EN CURSO
            </span>
          </div>
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Hola, Camila</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Sigue tus indicaciones diarias para recuperarte pronto de tu cuadro de {tratamiento.diagnostico}.
          </p>
        </div>
        
        <div className="relative shrink-0">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">1 nueva indicación</span>
          </button>
          
          <NotificationsMenu 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Columna Izquierda: Acciones de Hoy */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Banner de Registro de Síntomas (Vital para el Semáforo del Médico) */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm transition-colors ${sintomasRegistrados ? 'bg-green-50 border-green-200' : 'bg-teal-700 border-teal-800'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex justify-center items-center text-2xl shrink-0 ${sintomasRegistrados ? 'bg-green-200' : 'bg-teal-600'}`}>
                {sintomasRegistrados ? '✅' : '📝'}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className={`text-lg font-bold font-['Inter'] ${sintomasRegistrados ? 'text-green-800' : 'text-white'}`}>
                  {sintomasRegistrados ? '¡Check-in diario completado!' : 'Registro diario de síntomas'}
                </h2>
                <p className={`text-sm font-normal font-['Inter'] ${sintomasRegistrados ? 'text-green-700' : 'text-teal-100'}`}>
                  {sintomasRegistrados 
                    ? 'Tus datos han sido enviados al equipo médico.' 
                    : 'Registra tu temperatura, dolor e hidratación de hoy para que tu médico evalúe tu progreso.'}
                </p>
              </div>
            </div>
            {!sintomasRegistrados && (
              <button 
                onClick={() => setSintomasRegistrados(true)}
                className="w-full sm:w-auto px-6 py-3 bg-white text-teal-800 hover:bg-slate-50 transition-colors rounded-xl text-sm font-bold font-['Inter'] shrink-0 shadow-sm"
              >
                Registrar ahora
              </button>
            )}
          </div>

          {/* Progreso del Tratamiento */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h3 className="text-slate-900 text-lg font-bold font-['Inter']">Progreso del esquema</h3>
                <span className="text-slate-500 text-xs font-normal">Supervisado por {tratamiento.medico}</span>
              </div>
              <span className="text-teal-700 text-sm font-bold">Día {tratamiento.diaActual} de {tratamiento.totalDias}</span>
            </div>
            
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                style={{ width: `${progresoPorcentaje}%` }} 
              />
            </div>

            {/* Lista de Medicamentos */}
            <div className="mt-2 flex flex-col gap-3">
              {tratamiento.medicamentos.map(med => (
                <div key={med.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex justify-center items-center text-lg shadow-sm shrink-0">
                      💊
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 text-sm font-bold">{med.nombre}</span>
                      <span className="text-slate-600 text-xs">{med.indicacion}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-slate-900 text-xs font-semibold">{med.proxima}</span>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${med.estado === 'Pendiente' ? 'bg-teal-700 text-white hover:bg-teal-800' : 'bg-slate-200 text-slate-600'}`}>
                      {med.estado === 'Pendiente' ? 'Marcar tomado' : 'Opcional'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mensaje Rápido Médico */}
          <section className="p-5 bg-teal-50 rounded-2xl border border-teal-200 flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-200 rounded-full flex justify-center items-center shrink-0">
              <span className="text-teal-800 font-bold text-sm">VR</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-teal-900 text-sm font-bold">Mensaje de tu médica</span>
              <p className="text-teal-800 text-xs leading-relaxed">
                "Hola Camila. Recibí los resultados de tus exámenes preliminares. El antibiótico es el correcto. Por favor, no olvides tomar mucha agua hoy y descansar. Si la fiebre sube de 38°C, avísame por el chat."
              </p>
              <button className="text-teal-700 text-xs font-bold underline mt-1 self-start">
                Ir a mensajes
              </button>
            </div>
          </section>
        </div>

        {/* Columna Derecha: Alertas e Info */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Señales de Alarma (Muy importante clínicamente) */}
          <section className="p-6 bg-red-50 rounded-2xl border border-red-200 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <h3 className="text-red-800 text-base font-bold">Cuándo ir a Urgencias</h3>
            </div>
            <p className="text-red-700 text-xs font-normal">
              Si presentas alguno de estos síntomas, acude al centro de salud más cercano:
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2 bg-white p-3 rounded-lg border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span className="text-slate-700 text-xs">Fiebre sobre 38°C que no baja con medicamentos o escalofríos intensos.</span>
              </li>
              <li className="flex items-start gap-2 bg-white p-3 rounded-lg border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span className="text-slate-700 text-xs">Vómitos repetidos que no te permiten tomar líquidos o tus pastillas.</span>
              </li>
              <li className="flex items-start gap-2 bg-white p-3 rounded-lg border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span className="text-slate-700 text-xs">Aumento severo del dolor en la espalda o el costado.</span>
              </li>
            </ul>
          </section>

          {/* Exámenes Pendientes */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Tus exámenes</h3>
            
            <div className="flex flex-col gap-3">
              {tratamiento.examenes.map((ex, idx) => (
                <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="text-slate-900 text-sm font-semibold">{ex.nombre}</span>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">{ex.fecha}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {ex.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
        </div>

      </div>
    </main>
  );
}