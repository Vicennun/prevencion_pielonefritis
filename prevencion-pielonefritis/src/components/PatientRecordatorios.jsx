import React, { useState } from 'react';
import NotificationsMenu from './NotificationsMenu';

export default function PatientRecordatorios() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Helper para las tarjetas de recordatorios
  const ReminderCard = ({ title, desc, tag, iconPath }) => (
    <div className="w-full p-4 bg-gray-50 rounded-xl border border-slate-200 flex items-start gap-3">
      {/* Icon Placeholder (Usando un div verde simulado por ahora) */}
      <div className="w-8 h-8 bg-teal-100 rounded-[10px] flex justify-center items-center shrink-0">
        <div className="w-4 h-4 text-teal-800 flex justify-center items-center">
          {/* Aquí puedes reemplazar por SVG reales más adelante */}
          <span className="text-[10px] font-bold">R</span>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="flex-1 flex flex-col gap-1">
        <h4 className="text-slate-900 text-sm font-semibold font-['Inter']">{title}</h4>
        <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-tight">{desc}</p>
      </div>

      {/* Etiqueta / Tag */}
      <div className="px-2.5 py-1 bg-teal-100 rounded-full shrink-0">
        <span className="text-teal-800 text-xs font-semibold font-['Inter']">{tag}</span>
      </div>
    </div>
  );

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto relative">
      
      {/* Header con Notificaciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
            Recordatorios para cuidar tu salud
          </h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Organiza tus recordatorios de medicamentos, citas y cuidados para dar seguimiento a tu salud.
          </p>
        </div>
        
        <div className="relative shrink-0">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">3 notificaciones</span>
          </button>
          
          <NotificationsMenu 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Columna Principal (Lista de Recordatorios) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">Recordatorios de procedimientos y cuidados</h2>
              <p className="text-slate-500 text-xs font-normal font-['Inter']">
                Ejemplos ilustrativos de recordatorios indicados por el profesional para esta condición.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <ReminderCard 
                title="Ejemplo: hidratación"
                desc="Mantener una ingesta adecuada de líquidos para ayudar a eliminar residuos y prevenir complicaciones."
                tag="Diario"
              />
              <ReminderCard 
                title="Ejemplo: temperatura"
                desc="Revisar temperatura corporal si se presentan síntomas como escalofrío o fiebre."
                tag="Alarma"
              />
              <ReminderCard 
                title="Ejemplo: seguimiento"
                desc="Mantener una agenda de control para revisar síntomas, evolución y ajustes indicados por el profesional."
                tag="Semanal"
              />
            </div>

            <div className="mt-1 px-3 py-2.5 bg-gray-50 rounded-[10px] flex items-start gap-2">
              <div className="w-4 h-4 pt-0.5 shrink-0 flex justify-center items-center">
                <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-full" />
              </div>
              <p className="text-slate-500 text-xs font-normal font-['Inter'] leading-relaxed">
                Estos recordatorios son ejemplos ilustrativos y no reemplazan las indicaciones específicas del profesional.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">Próximas citas</h2>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-slate-900 text-sm font-semibold font-['Inter']">Ejemplo: control de seguimiento</h3>
              <p className="text-slate-500 text-xs font-normal font-['Inter']">
                Revisión de síntomas y ajustes de cuidados con el profesional asignado.
              </p>
            </div>
            <button className="w-full mt-2 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center">
              Ver agenda
            </button>
          </section>

        </div>

        {/* Columna Secundaria (Widgets del Paciente - Mantenemos la consistencia) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Datos del paciente</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Paciente</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">Camila Soto</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Rut</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">xx.xxx.xxx-x</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Edad</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">24</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Contacto</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">+569 xxxx xxxx</span>
              </div>
            </div>

            <button className="w-full mt-2 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center">
              Ver historial
            </button>
          </section>

          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Próxima consulta</h3>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">Consulta aún no requerida</span>
              <span className="text-slate-500 text-xs font-normal font-['Inter']">Un profesional te será asignado si lo necesitas</span>
            </div>
            <button className="w-full mt-1 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center">
              Ver más información
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}