import React from 'react';

export default function PatientMensajes() {
  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-hidden">
      
      {/* Header de la vista */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Mensajes</h1>
        <p className="text-slate-500 text-sm font-normal font-['Inter']">
          Conversa con tu médico y comparte imágenes de forma segura
        </p>
      </div>

      {/* Contenedor principal del Chat */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        
        {/* Panel Izquierdo: Lista de Conversaciones */}
        <div className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0">
          <div className="px-4 py-5">
            <h2 className="text-slate-500 text-xs font-semibold font-['Inter'] uppercase tracking-wide">Conversaciones</h2>
          </div>
          
          <div className="flex flex-col px-2 pb-2 gap-1 overflow-y-auto">
            {/* Chat Activo */}
            <button className="w-full p-3 bg-teal-50 hover:bg-teal-100 transition-colors rounded-xl flex items-center gap-3 text-left">
              <div className="w-10 h-10 shrink-0 bg-teal-100 rounded-full flex justify-center items-center">
                <span className="text-teal-800 text-sm font-semibold font-['Inter']">VR</span>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate">Dra. Valentina Rojas</span>
                <span className="text-slate-500 text-xs font-normal font-['Inter'] truncate">Gracias por la foto</span>
              </div>
              <span className="text-slate-500 text-xs font-normal font-['Inter'] shrink-0">10:42</span>
            </button>

            {/* Chat Inactivo */}
            <button className="w-full p-3 hover:bg-slate-50 transition-colors rounded-xl flex items-center gap-3 text-left">
              <div className="w-10 h-10 shrink-0 bg-teal-100 rounded-full flex justify-center items-center">
                <span className="text-teal-800 text-sm font-semibold font-['Inter']">SO</span>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate">Soporte</span>
                <span className="text-slate-500 text-xs font-normal font-['Inter'] truncate">Tu cuenta fue verificada</span>
              </div>
              <span className="text-slate-500 text-xs font-normal font-['Inter'] shrink-0">Ayer</span>
            </button>
          </div>
        </div>

        {/* Panel Derecho: Chat Activo */}
        <div className="flex-1 flex flex-col h-full bg-white">
          
          {/* Header del Chat */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 shrink-0 bg-teal-100 rounded-full flex justify-center items-center">
              <span className="text-teal-800 text-sm font-semibold font-['Inter']">VR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 text-base font-semibold font-['Inter']">Dra. Valentina Rojas</span>
              <span className="text-green-700 text-xs font-normal font-['Inter']">Médico tratante · En línea</span>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-white">
            
            {/* Mensaje Recibido */}
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                <p className="text-slate-900 text-sm font-normal font-['Inter'] leading-relaxed">
                  Hola Camila, revisé tus últimos controles. ¿Cómo te has sentido esta semana?
                </p>
              </div>
            </div>

            {/* Mensaje Enviado */}
            <div className="flex justify-end">
              <div className="bg-teal-700 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                <p className="text-white text-sm font-normal font-['Inter'] leading-relaxed">
                  Hola doctora. Con algo de dolor de cabeza en las mañanas.
                </p>
              </div>
            </div>

            {/* Mensaje Enviado con Imagen */}
            <div className="flex justify-end">
              <div className="bg-teal-700 rounded-2xl rounded-tr-sm p-2 max-w-[85%] sm:max-w-[70%] flex flex-col gap-2">
                <div className="w-full sm:w-64 h-36 bg-slate-300 rounded-xl flex justify-center items-center overflow-hidden">
                  <span className="text-slate-600 text-xs font-medium font-['Inter']">Imagen adjunta</span>
                  {/* Aquí irá un tag <img /> cuando conectemos el storage de Supabase */}
                </div>
                <div className="px-2 pb-1">
                  <p className="text-white text-xs font-normal font-['Inter']">
                    Mi medición de hoy
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje Recibido */}
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                <p className="text-slate-900 text-sm font-normal font-['Inter'] leading-relaxed">
                  Gracias por la foto. Está dentro de lo esperado, pero mantengamos el control dos veces por semana.
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 bg-white">
            <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center shrink-0">
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">Adjuntar imagen</span>
            </button>
            <input 
              type="text" 
              placeholder="Escribe un mensaje…" 
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-['Inter'] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-shadow"
            />
            <button className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 transition-colors rounded-xl flex justify-center items-center shrink-0">
              <span className="text-white text-sm font-semibold font-['Inter']">Enviar</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}