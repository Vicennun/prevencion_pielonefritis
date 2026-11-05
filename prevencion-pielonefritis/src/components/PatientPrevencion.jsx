import React, { useState } from 'react';
import NotificationsMenu from './NotificationsMenu';

export default function PatientPrevencion() {

  const [showNotifications, setShowNotifications] = useState(false);
  
  // Helpers para no repetir tanto código HTML en las tarjetas de consejos
  const TipCard = ({ colorStyle, iconColor, title, desc }) => (
    <div className={`p-3 bg-white rounded-[10px] border border-${colorStyle}-200 flex items-start gap-2.5 shadow-sm`}>
      <div className={`w-7 h-7 bg-${colorStyle}-100 rounded-lg flex justify-center items-center shrink-0`}>
        <div className={`w-2.5 h-2.5 bg-${iconColor} rounded-[3px]`} />
      </div>
      <div className="flex flex-col gap-[3px]">
        <h4 className="text-slate-900 text-xs font-semibold font-['Inter'] leading-4">{title}</h4>
        <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-4">{desc}</p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header Modificado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
            Prevención y cuidados en pielonefritis
          </h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Aprende a reducir el riesgo de complicaciones y a identificar señales de alarma para consultar a tu médico de forma oportuna.
          </p>
        </div>
        
        {/* Contenedor relativo para posicionar el dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">3 notificaciones</span>
          </button>
          
          {/* Componente Dropdown */}
          <NotificationsMenu 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Columna Principal (Contenido de Prevención) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Tips para evitar la pielonefritis</h2>
              <p className="text-slate-500 text-xs font-normal font-['Inter']">
                La pielonefritis casi siempre comienza como una infección urinaria baja que sube hacia el riñón. Con buenos hábitos y una consulta a tiempo puedes evitar que avance.
              </p>
            </div>

            {/* Bloque 1: Hábitos */}
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex flex-col gap-3.5">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-teal-800 text-sm font-bold font-['Inter']">Hábitos que protegen tus vías urinarias</h3>
                <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-4">
                  Son tu mejor defensa: una infección urinaria bien prevenida no llega al riñón.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TipCard 
                  colorStyle="slate" 
                  iconColor="teal-700" 
                  title="Hidrátate bien" 
                  desc="Bebe agua durante todo el día (aprox. 1,5 a 2 litros, salvo indicación médica) para ayudar a eliminar bacterias." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="teal-700" 
                  title="No retengas la orina" 
                  desc="Ve al baño cuando sientas ganas y vacía la vejiga por completo cada vez." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="teal-700" 
                  title="Orina después de relaciones sexuales" 
                  desc="Ayuda a expulsar bacterias que puedan haber entrado a la uretra." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="teal-700" 
                  title="Higiene correcta" 
                  desc="Límpiate de adelante hacia atrás. Evita duchas vaginales y productos perfumados en la zona íntima." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="teal-700" 
                  title="Ropa y comodidad" 
                  desc="Prefiere ropa interior de algodón, evita prendas muy ajustadas y cámbiate pronto si hay humedad." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="teal-700" 
                  title="Actúa a los primeros síntomas" 
                  desc="Ardor, urgencia o cambios en la orina: consulta pronto. No te automediques con antibióticos." 
                />
              </div>
            </div>

            {/* Bloque 2: Señales de Alarma */}
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex flex-col gap-3.5">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-red-800 text-sm font-bold font-['Inter']">Señales de alarma: cuándo consultar</h3>
                <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-4">
                  Si una infección urinaria avanza, el cuerpo suele avisar. Estas señales pueden indicar pielonefritis.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TipCard 
                  colorStyle="red" 
                  iconColor="red-700" 
                  title="Fiebre o escalofríos" 
                  desc="Temperatura sobre 38 °C o escalofríos junto con síntomas urinarios." 
                />
                <TipCard 
                  colorStyle="red" 
                  iconColor="red-700" 
                  title="Dolor de espalda o costado" 
                  desc="Dolor lumbar, a un lado o bajo las costillas, que no cede." 
                />
                <TipCard 
                  colorStyle="red" 
                  iconColor="red-700" 
                  title="Náuseas o vómitos" 
                  desc="Malestar general, decaimiento o vómitos junto con síntomas urinarios." 
                />
                <TipCard 
                  colorStyle="red" 
                  iconColor="red-700" 
                  title="Orina con sangre o muy turbia" 
                  desc="Cambios marcados en el color o el olor, o ardor que empeora." 
                />
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-2 h-2 bg-red-700 rounded-full shrink-0" />
                <p className="text-xs font-['Inter'] leading-4">
                  <span className="text-red-800 font-semibold">Si notas alguna, consulta a un profesional el mismo día. </span>
                  <span className="text-red-800 font-normal">No esperes a que pasen solas.</span>
                </p>
              </div>
            </div>

            {/* Bloque 3: Infección Urinaria Existente */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-400 flex flex-col gap-3.5">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-slate-900 text-sm font-bold font-['Inter']">Si ya tienes una infección urinaria</h3>
                <p className="text-slate-600 text-xs font-normal font-['Inter'] leading-4">
                  Tratarla bien y a tiempo es la forma más segura de evitar que llegue al riñón.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TipCard 
                  colorStyle="slate" 
                  iconColor="stone-500" 
                  title="Termina el tratamiento" 
                  desc="Si te indicaron antibióticos, tómalos completos aunque te sientas mejor." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="stone-500" 
                  title="Respeta horarios y dosis" 
                  desc="No suspendas ni cambies la indicación sin hablar con tu profesional de salud." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="stone-500" 
                  title="Descansa e hidrátate" 
                  desc="Beber agua y descansar ayuda a tu cuerpo a recuperarse." 
                />
                <TipCard 
                  colorStyle="slate" 
                  iconColor="stone-500" 
                  title="Asiste a tus controles" 
                  desc="Si te piden un examen de orina de control, no lo omitas." 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Columna Secundaria (Widgets del Paciente - Reutilizados de la vista anterior) */}
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