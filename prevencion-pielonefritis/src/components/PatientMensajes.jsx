import React, { useEffect, useRef, useState } from 'react';
import { api, getStoredUser } from '../services/api';

export default function PatientMensajes() {
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const pacienteId = getStoredUser()?.id || 3;
  const [profesionales, setProfesionales] = useState([]);
  const [selectedProId, setSelectedProId] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const cargarProfesionales = async () => {
    try {
      const pros = await api.getProfesionales();
      setProfesionales(pros || []);
      if (pros?.length && !selectedProId) {
        // Prioriza Dra. Valentina si existe, o el primero de la lista
        const defaultPro = pros.find((p) => p.id === 2) || pros[0];
        setSelectedProId(defaultPro.id);
      }
    } catch (err) {
      console.error('Error cargando profesionales:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarConversacion = async (proId) => {
    if (!proId) return;
    try {
      const data = await api.getConversacion(pacienteId, proId);
      setMensajes(data || []);
    } catch (err) {
      console.error('Error cargando conversación:', err);
    }
  };

  useEffect(() => {
    cargarProfesionales();
  }, []);

  useEffect(() => {
    if (!selectedProId) return;
    cargarConversacion(selectedProId);
    const interval = setInterval(() => cargarConversacion(selectedProId), 6000);
    return () => clearInterval(interval);
  }, [selectedProId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes.length]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if ((!texto.trim() && !imagenFile) || !selectedProId) return;
    setSending(true);
    try {
      let imagenUrl = null;
      if (imagenFile) {
        imagenUrl = await api.subirImagenChat(imagenFile);
      }
      await api.enviarMensaje({
        remitenteId: pacienteId,
        destinatarioId: selectedProId,
        contenido: texto.trim() || (imagenUrl ? 'Imagen adjunta' : ''),
        imagenUrl,
      });
      setTexto('');
      setImagenFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await cargarConversacion(selectedProId);
    } catch (err) {
      alert(`No se pudo enviar el mensaje: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name = '') =>
    name
      .replace(/^(Dr\.|Dra\.)\s*/i, '')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const activePro = profesionales.find((p) => p.id === selectedProId);

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Mensajes</h1>
        <p className="text-slate-500 text-sm font-normal font-['Inter']">
          Conversa con tu equipo médico. Evita enviar fotos que contengan datos personales identificables fuera de lo clínico.
        </p>
      </div>

      {/* Contenedor Chat */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row overflow-hidden min-h-[540px] max-h-[75vh]">
        {/* Panel Izquierdo: Profesionales */}
        <div className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0">
          <div className="px-4 py-4 border-b border-slate-100">
            <h2 className="text-slate-500 text-xs font-semibold font-['Inter'] uppercase tracking-wide">
              Equipo médico
            </h2>
          </div>

          <div className="flex flex-col p-2 gap-1 overflow-y-auto">
            {loading && <p className="p-3 text-xs text-slate-500">Cargando contactos...</p>}
            {profesionales.map((pro) => {
              const isSelected = pro.id === selectedProId;
              return (
                <button
                  key={pro.id}
                  onClick={() => setSelectedProId(pro.id)}
                  className={`w-full p-3 transition-colors rounded-xl flex items-center gap-3 text-left cursor-pointer ${
                    isSelected ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 bg-teal-100 rounded-full flex justify-center items-center">
                    <span className="text-teal-800 text-sm font-semibold font-['Inter']">
                      {getInitials(pro.nombreCompleto)}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate">
                      {pro.nombreCompleto}
                    </span>
                    <span className="text-slate-500 text-xs font-normal font-['Inter'] truncate">
                      {pro.especialidad || 'Profesional de salud'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel Derecho: Chat Activo */}
        <div className="flex-1 flex flex-col h-full bg-white min-h-[420px]">
          {activePro ? (
            <>
              {/* Header Chat */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 bg-teal-100 rounded-full flex justify-center items-center">
                    <span className="text-teal-800 text-sm font-semibold">
                      {getInitials(activePro.nombreCompleto)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 text-base font-semibold">{activePro.nombreCompleto}</span>
                    <span className="text-teal-700 text-xs">{activePro.especialidad || 'Equipo tratante'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cargarConversacion(selectedProId)}
                  className="text-xs font-semibold text-slate-500 hover:text-teal-700 cursor-pointer"
                >
                  Actualizar
                </button>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto bg-slate-50/40">
                {mensajes.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    Aún no hay mensajes con {activePro.nombreCompleto}. Escribe el primero abajo.
                  </div>
                ) : (
                  mensajes.map((m) => {
                    const esMio = m.remitente_id === pacienteId;
                    return (
                      <div key={m.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[70%] flex flex-col gap-2 ${
                            esMio
                              ? 'bg-teal-700 text-white rounded-tr-sm'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                          }`}
                        >
                          {m.imagen_url && (
                            <a href={m.imagen_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={m.imagen_url}
                                alt="Adjunto"
                                className="max-w-full sm:max-w-xs max-h-56 rounded-xl object-cover border border-white/20"
                              />
                            </a>
                          )}
                          {m.contenido && (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.contenido}</p>
                          )}
                          <span className={`text-[10px] ${esMio ? 'text-teal-100 text-right' : 'text-slate-400'}`}>
                            {new Date(m.fecha_envio).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleEnviar}
                className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col gap-2 shrink-0 bg-white"
              >
                {imagenFile && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
                    <span className="truncate">Imagen seleccionada: {imagenFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImagenFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-teal-700 font-semibold ml-3 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-900 text-sm font-semibold shrink-0 cursor-pointer"
                  >
                    Adjuntar imagen
                  </button>
                  <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe un mensaje…"
                    className="flex-1 min-w-[180px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700"
                  />
                  <button
                    type="submit"
                    disabled={sending || (!texto.trim() && !imagenFile)}
                    className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors rounded-xl text-white text-sm font-semibold shrink-0 cursor-pointer"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecciona un profesional para conversar.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}