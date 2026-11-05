import React, { useState } from 'react';

export default function ProMensajes() {
  // Estado para el filtro de mensajes
  const [activeTab, setActiveTab] = useState('Todos');

  // Datos mockeados de conversaciones
  const conversaciones = [
    {
      id: 1,
      initials: 'RR', initialsBg: 'bg-red-700/30', initialsColor: 'text-red-700',
      name: 'Rodrigo Rojas',
      lastMessage: 'Dolor de cabeza al despertar...',
      time: '10:42',
      unread: true,
      tag: 'Crítico'
    },
    {
      id: 2,
      initials: 'ES', initialsBg: 'bg-amber-100', initialsColor: 'text-yellow-600',
      name: 'Ernesto Salamanca',
      lastMessage: '¿Puedo comer frutas en la tarde?',
      time: 'Ayer',
      unread: true,
      tag: null
    },
    {
      id: 3,
      initials: 'CÑ', initialsBg: 'bg-red-700/30', initialsColor: 'text-red-700',
      name: 'Camila Ñuñez',
      lastMessage: 'Doc, adjunto el examen.',
      time: 'Lun',
      unread: false,
      tag: 'Revisión'
    },
    {
      id: 4,
      initials: 'SO', initialsBg: 'bg-slate-200', initialsColor: 'text-slate-700',
      name: 'Soporte Técnico',
      lastMessage: 'Sistema actualizado exitosamente.',
      time: '12 Sep',
      unread: false,
      tag: null
    }
  ];

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Mensajes</h1>
        <p className="text-slate-500 text-sm font-normal font-['Inter']">
          Comunícate con tus pacientes y revisa imágenes de seguimiento.
        </p>
      </div>

      {/* Contenedor principal del Chat */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row overflow-hidden min-h-[600px] shadow-sm">
        
        {/* Panel Izquierdo: Lista de Conversaciones */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          
          {/* Cabecera, Buscador y Filtros */}
          <div className="p-4 flex flex-col gap-4 border-b border-slate-200">
            <h2 className="text-slate-900 text-base font-semibold font-['Inter']">Bandeja de entrada</h2>
            
            {/* Buscador de pacientes */}
            <div className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 flex items-center">
              <input 
                type="text" 
                placeholder="Buscar paciente o mensaje..." 
                className="w-full bg-transparent text-slate-700 placeholder:text-gray-400 text-xs font-normal font-['Inter'] focus:outline-none"
              />
            </div>

            {/* Tabs de Filtro */}
            <div className="flex gap-2 bg-slate-200/50 p-1 rounded-lg">
              {['Todos', 'No leídos', 'Críticos'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-semibold font-['Inter'] rounded-md transition-colors ${
                    activeTab === tab 
                      ? 'bg-white text-red-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Lista Scrolleable */}
          <div className="flex flex-col p-2 gap-1 overflow-y-auto">
            {conversaciones.map(chat => (
              <button 
                key={chat.id}
                className={`w-full p-3 transition-colors rounded-xl flex items-start gap-3 text-left border ${
                  chat.id === 1 // Simulamos que el chat 1 es el activo
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-white border-transparent hover:border-slate-200'
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex justify-center items-center ${chat.initialsBg}`}>
                  <span className={`text-sm font-semibold font-['Inter'] ${chat.initialsColor}`}>{chat.initials}</span>
                </div>
                
                {/* Info Text */}
                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-sm font-semibold font-['Inter'] truncate ${chat.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {chat.name}
                    </span>
                    <span className="text-slate-500 text-[10px] font-normal font-['Inter'] shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <span className={`text-xs font-normal font-['Inter'] truncate ${chat.unread ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {chat.lastMessage}
                  </span>
                  
                  {/* Tags (Opcional) */}
                  {chat.tag && (
                    <div className="mt-1 flex">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-semibold font-['Inter']">
                        {chat.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Unread dot */}
                {chat.unread && (
                  <div className="w-2 h-2 mt-1.5 bg-red-600 rounded-full shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Chat Activo */}
        <div className="flex-1 flex flex-col h-[500px] md:h-auto bg-white">
          
          {/* Header del Chat */}
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 bg-red-700/30 rounded-full flex justify-center items-center">
                <span className="text-red-700 text-sm font-semibold font-['Inter']">RR</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 text-base font-semibold font-['Inter']">Rodrigo Rojas</span>
                <span className="text-slate-500 text-xs font-normal font-['Inter']">Paciente · PAC-001420</span>
              </div>
            </div>
            
            <button className="text-slate-500 hover:text-red-700 text-xs font-semibold font-['Inter'] transition-colors">
              Ver ficha
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-white">
            
            {/* Mensaje Recibido (Paciente) */}
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                <p className="text-slate-900 text-sm font-normal font-['Inter'] leading-relaxed">
                  Doctor, desperté con mucho dolor de cabeza y algo mareado. ¿Debería ir a urgencias?
                </p>
                <span className="text-slate-400 text-[10px] font-normal mt-1 block">10:42</span>
              </div>
            </div>

            {/* Mensaje Enviado (Profesional) */}
            <div className="flex justify-end">
              <div className="bg-red-700 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-[70%]">
                <p className="text-white text-sm font-normal font-['Inter'] leading-relaxed">
                  Hola Rodrigo. Tómate la presión ahora mismo y envíame la foto del monitor, por favor. No tomes nada aún.
                </p>
                <span className="text-red-200 text-[10px] font-normal mt-1 block text-right">10:45</span>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 bg-white">
            <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center shrink-0">
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">Adjuntar</span>
            </button>
            <input 
              type="text" 
              placeholder="Escribe un mensaje al paciente..." 
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-['Inter'] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-shadow"
            />
            <button className="px-6 py-2.5 bg-red-700 hover:bg-red-800 transition-colors rounded-xl flex justify-center items-center shrink-0 shadow-sm">
              <span className="text-white text-sm font-semibold font-['Inter']">Enviar</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}