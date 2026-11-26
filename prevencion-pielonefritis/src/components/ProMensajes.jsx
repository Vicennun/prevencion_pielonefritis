import React, { useEffect, useRef, useState } from 'react';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META, ordenarPorPrioridadClinica } from '../services/clinicalEngine';

const MENSAJES_RAPIDOS = [
  {
    corto: 'Control presencial',
    texto: 'Solicito que asistas a valoración presencial hoy. Por favor confirma recepción.',
  },
  {
    corto: 'Cultivo disponible',
    texto: 'Tu cultivo está disponible; por favor contáctame para revisar el resultado y la conducta.',
  },
  {
    corto: 'Sin mejoría 48–72h',
    texto: 'Si no comienzas a mejorar en 48–72 horas o empeoras antes, solicita reevaluación.',
  },
  {
    corto: 'No suspender ATB',
    texto: 'No cambies ni suspendas el antibiótico indicado sin evaluación profesional.',
  },
  {
    corto: 'Intolerancia oral',
    texto: 'Si presentas vómitos persistentes y no toleras líquidos o medicamentos, acude a valoración urgente.',
  },
];

export default function ProMensajes({ pacienteInicialId }) {
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const proId = getStoredUser()?.id || 1;
  const [activeTab, setActiveTab] = useState('Todos');
  const [search, setSearch] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacId, setSelectedPacId] = useState(pacienteInicialId || null);

  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const cargarContactos = async () => {
    try {
      const [pacs, segs, allMsgs] = await Promise.all([
        api.getPacientes(),
        api.getSeguimientos(),
        api.getMensajesUsuario(proId),
      ]);

      const segMap = new Map((segs || []).map((s) => [s.paciente_id, s]));
      const lastMsgMap = new Map();
      (allMsgs || []).forEach((m) => {
        const otherId = m.remitente_id === proId ? m.destinatario_id : m.remitente_id;
        if (!lastMsgMap.has(otherId)) lastMsgMap.set(otherId, m);
      });

      const lista = (pacs || []).map((p) => {
        const seg = segMap.get(p.id);
        const last = lastMsgMap.get(p.id);
        return {
          ...p,
          nivelSemaforo: seg?.nivel_semaforo || 'INFORMACION_INSUFICIENTE',
          lastMessage: last?.contenido || 'Sin mensajes aún',
          lastTime: last?.fecha_envio || null,
          hasMessages: Boolean(last),
          unread: Boolean(last && last.destinatario_id === proId && !last.leido),
        };
      });

      const ordenados = ordenarPorPrioridadClinica(lista, (item) => item.nivelSemaforo);
      setPacientes(ordenados);

      if (ordenados.length) {
        if (pacienteInicialId && ordenados.some((p) => p.id === pacienteInicialId)) {
          setSelectedPacId(pacienteInicialId);
        } else if (!selectedPacId) {
          const conMensajes = ordenados.find((p) => p.hasMessages);
          setSelectedPacId((conMensajes || ordenados[0]).id);
        }
      }
    } catch (err) {
      console.error('Error cargando bandeja profesional:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarConversacion = async (pacId) => {
    if (!pacId) return;
    try {
      const data = await api.getConversacion(proId, pacId);
      setMensajes(data || []);
    } catch (err) {
      console.error('Error cargando conversación:', err);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, [pacienteInicialId]);

  useEffect(() => {
    if (!selectedPacId) return;
    cargarConversacion(selectedPacId);
    const interval = setInterval(() => cargarConversacion(selectedPacId), 6000);
    return () => clearInterval(interval);
  }, [selectedPacId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes.length]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if ((!texto.trim() && !imagenFile) || !selectedPacId) return;
    setSending(true);
    try {
      let imagenUrl = null;
      if (imagenFile) {
        imagenUrl = await api.subirImagenChat(imagenFile);
      }
      await api.enviarMensaje({
        remitenteId: proId,
        destinatarioId: selectedPacId,
        contenido: texto.trim() || (imagenUrl ? 'Imagen adjunta' : ''),
        imagenUrl,
      });
      setTexto('');
      setImagenFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await cargarConversacion(selectedPacId);
    } catch (err) {
      alert(`No se pudo enviar: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const filteredChats = pacientes.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.nombreCompleto.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (activeTab === 'Críticos') {
      return p.nivelSemaforo === 'URGENCIA_INMEDIATA' || p.nivelSemaforo === 'ROJO';
    }
    if (activeTab === 'Con mensajes') {
      return p.hasMessages;
    }
    return true;
  });

  const activePac = pacientes.find((p) => p.id === selectedPacId);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-blue-700 text-3xl font-bold font-['Inter']">Mensajes</h1>
        <p className="text-slate-600 text-sm">
          Comunícate con tus pacientes priorizados y revisa imágenes clínicas compartidas.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row overflow-hidden min-h-[540px] max-h-[76vh] shadow-sm">
        {/* Lista de Pacientes */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          <div className="p-4 flex flex-col gap-3 border-b border-slate-200">
            <h2 className="text-slate-900 text-base font-bold">Bandeja de entrada</h2>

            <div className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar paciente..."
                className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-lg">
              {['Todos', 'Críticos', 'Con mensajes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col p-2 gap-1 overflow-y-auto">
            {loading && <p className="p-3 text-xs text-slate-500">Cargando pacientes...</p>}
            {filteredChats.map((chat) => {
              const meta = PRIORIDAD_META[chat.nivelSemaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
              const isSelected = chat.id === selectedPacId;
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedPacId(chat.id)}
                  className={`w-full p-3 transition-colors rounded-xl flex items-start gap-3 text-left border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 text-blue-700 flex justify-center items-center text-xs font-bold">
                    {getInitials(chat.nombreCompleto)}
                  </div>

                  <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">{chat.nombreCompleto}</span>
                      {chat.lastTime && (
                        <span className="text-slate-400 text-[10px] shrink-0">
                          {new Date(chat.lastTime).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 truncate">{chat.lastMessage}</span>
                    <span className={`self-start mt-1 px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${meta.badge}`}>
                      {meta.short}
                    </span>
                  </div>

                  {chat.unread && <div className="w-2 h-2 mt-1.5 bg-blue-600 rounded-full shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel Derecho: Chat Activo */}
        <div className="flex-1 flex flex-col bg-white min-h-[420px]">
          {activePac ? (
            <>
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex justify-center items-center text-blue-700 text-sm font-bold">
                    {getInitials(activePac.nombreCompleto)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 text-base font-bold">{activePac.nombreCompleto}</span>
                    <span className="text-slate-500 text-xs">
                      Paciente · PAC-{String(activePac.id).padStart(4, '0')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`#profesional/seguimiento-activo/${activePac.id}`}
                    className="text-blue-700 hover:underline text-xs font-semibold"
                  >
                    Monitor
                  </a>
                  <a
                    href={`#profesional/detalle-paciente/${activePac.id}`}
                    className="text-teal-700 hover:underline text-xs font-semibold"
                  >
                    Ver ficha
                  </a>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto bg-slate-50/40">
                {mensajes.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    No hay mensajes aún con {activePac.nombreCompleto}.
                  </div>
                ) : (
                  mensajes.map((m) => {
                    const esMio = m.remitente_id === proId;
                    return (
                      <div key={m.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[70%] flex flex-col gap-2 ${
                            esMio
                              ? 'bg-blue-700 text-white rounded-tr-sm'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                          }`}
                        >
                          {m.imagen_url && (
                            <a href={m.imagen_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={m.imagen_url}
                                alt="Adjunto clínico"
                                className="max-w-full sm:max-w-xs max-h-56 rounded-xl object-cover"
                              />
                            </a>
                          )}
                          {m.contenido && <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.contenido}</p>}
                          <span className={`text-[10px] ${esMio ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                            {new Date(m.fecha_envio).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Barra compacta opcional de respuestas rápidas (colapsada por defecto) */}
              <div className="px-4 sm:px-6 pt-2.5 border-t border-slate-200 bg-white flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowQuickReplies((v) => !v)}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    {showQuickReplies ? 'Ocultar respuestas rápidas' : '+ Respuestas rápidas clínicas'}
                  </button>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Evitar compartir fotos identificables fuera del flujo seguro
                  </span>
                </div>

                {showQuickReplies && (
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {MENSAJES_RAPIDOS.map((mr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTexto(mr.texto);
                          setShowQuickReplies(false);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-700 shrink-0 cursor-pointer"
                      >
                        {mr.corto}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleEnviar} className="px-4 sm:px-6 py-3 flex flex-col gap-2 shrink-0 bg-white">
                {imagenFile && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                    <span className="truncate">Imagen adjunta: {imagenFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImagenFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-blue-700 font-semibold ml-3 cursor-pointer"
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
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-900 text-sm font-semibold shrink-0 cursor-pointer"
                  >
                    Adjuntar
                  </button>
                  <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe un mensaje al paciente..."
                    className="flex-1 min-w-[180px] px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
                  />
                  <button
                    type="submit"
                    disabled={sending || (!texto.trim() && !imagenFile)}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl text-white text-sm font-semibold shrink-0 shadow-sm cursor-pointer"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecciona un paciente para iniciar la conversación.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}