import React, { useState } from 'react';
import NotificationsMenu from './NotificationsMenu';

export default function PatientExamenes() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Simulamos el evento de soltar un archivo
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadedFile({ name: 'Urocultivo_Mateo_Octubre.pdf', size: '1.2 MB' });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Mis Exámenes</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Sube tus resultados de laboratorio para que tu equipo médico los revise.
          </p>
        </div>
        <div className="relative shrink-0">
          <button onClick={() => setShowNotifications(!showNotifications)} className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">1 nueva indicación</span>
          </button>
          <NotificationsMenu isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Zona de Subida */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">Subir nuevo documento</h2>
            
            {!uploadedFile ? (
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-full h-64 rounded-xl border-2 border-dashed flex flex-col justify-center items-center gap-3 transition-colors cursor-pointer ${isDragging ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex justify-center items-center text-teal-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <div className="text-center">
                  <p className="text-slate-900 text-sm font-semibold font-['Inter']">Haz clic para buscar o arrastra tu archivo aquí</p>
                  <p className="text-slate-500 text-xs font-normal font-['Inter'] mt-1">Soporta PDF, JPG o PNG (Max. 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 bg-teal-50 border border-teal-200 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex justify-center items-center">
                    📄
                  </div>
                  <div className="flex flex-col">
                    <span className="text-teal-900 text-sm font-semibold">{uploadedFile.name}</span>
                    <span className="text-teal-700 text-xs">{uploadedFile.size} · Subida completada</span>
                  </div>
                </div>
                <button onClick={() => setUploadedFile(null)} className="text-teal-700 text-xs font-semibold hover:underline">
                  Quitar
                </button>
              </div>
            )}

            <button 
              disabled={!uploadedFile}
              className={`w-full py-3 rounded-xl text-sm font-bold font-['Inter'] transition-colors ${uploadedFile ? 'bg-teal-700 text-white hover:bg-teal-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Enviar al equipo médico
            </button>
          </div>
        </div>

        {/* Historial de Exámenes */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-slate-900 text-base font-bold font-['Inter']">Historial de exámenes</h2>
          
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-lg flex justify-center items-center shrink-0 text-sm">📄</div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-900 text-sm font-semibold line-clamp-1">Examen_Orina_Completa.pdf</span>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">01 Oct 2026</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">Revisado</span>
                </div>
              </div>
            </div>
            {uploadedFile && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex justify-center items-center shrink-0 text-sm">📄</div>
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-slate-900 text-sm font-semibold line-clamp-1">{uploadedFile.name}</span>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">Hace un momento</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[10px] font-bold">Enviado</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}