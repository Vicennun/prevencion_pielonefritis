import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';

export default function PatientAtenciones() {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [atenciones, setAtenciones] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [solicitud, setSolicitud] = useState({
    profesionalId: '',
    tipo: 'control',
    modalidad: 'Presencial',
    titulo: '',
    motivoConsulta: '',
  });

  const cargar = async () => {
    try {
      const pacienteId = getStoredUser()?.id || 3;
      const [lista, pros] = await Promise.all([
        api.getAtencionesPaciente(pacienteId),
        api.getProfesionales(),
      ]);
      setAtenciones(lista || []);
      setProfesionales(pros || []);
      if (lista?.length && !selectedId) {
        setSelectedId(lista[0].id);
      }
      if (pros?.length && !solicitud.profesionalId) {
        setSolicitud((p) => ({ ...p, profesionalId: String(pros[0].id) }));
      }
    } catch (err) {
      console.error('Error cargando atenciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrearSolicitud = async (e) => {
    e.preventDefault();
    if (!solicitud.titulo.trim() || !solicitud.motivoConsulta.trim()) return;
    setSaving(true);
    try {
      const pacienteId = getStoredUser()?.id || 3;
      const creada = await api.crearAtencion({
        paciente_id: pacienteId,
        profesional_id: Number(solicitud.profesionalId || profesionales[0]?.id || 1),
        tipo: solicitud.tipo,
        titulo: solicitud.titulo.trim(),
        modalidad: solicitud.modalidad,
        gravedad: 'Amarillo',
        estado: 'En proceso',
        fecha_hora: new Date().toISOString(),
        motivo_consulta: solicitud.motivoConsulta.trim(),
        plan_indicaciones: 'Solicitud registrada por el paciente; sujeta a confirmación de horario en el portal institucional.',
      });
      setShowModal(false);
      setSolicitud({ ...solicitud, titulo: '', motivoConsulta: '' });
      await cargar();
      setSelectedId(creada.id);
    } catch (err) {
      alert(`Error al registrar solicitud: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filtered = atenciones.filter((a) => {
    if (activeFilter === 'Todas') return true;
    return a.estado === activeFilter;
  });

  const selectedAtencion = filtered.find((a) => a.id === selectedId) || filtered[0] || null;

  const countEnProceso = atenciones.filter((a) => a.estado === 'En proceso').length;
  const countCompletadas = atenciones.filter((a) => a.estado === 'Completado').length;

  const getBadgeStyle = (estado) => {
    if (estado === 'En proceso') return 'bg-teal-100 text-teal-800';
    if (estado === 'Cancelado') return 'bg-rose-100 text-rose-800';
    return 'bg-slate-200 text-slate-600';
  };

  const parseFecha = (iso) => {
    const d = new Date(iso);
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleDateString('es-CL', { month: 'short' }).toUpperCase().replace('.', ''),
      full: d.toLocaleString('es-CL', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }),
      time: d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 text-xs font-semibold font-['Inter'] tracking-wide">SALUD Y SEGUIMIENTO</span>
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Mis atenciones</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Revisa tus controles de seguimiento urinarios y el historial de tus atenciones.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-3 bg-teal-700 hover:bg-teal-800 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0 cursor-pointer"
        >
          Solicitar una atención
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex justify-center items-center">
            <span className="text-slate-900 text-xl font-bold">{countEnProceso}</span>
          </div>
          <span className="text-slate-600 text-xs font-medium">Atenciones en proceso</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex justify-center items-center">
            <span className="text-slate-900 text-xl font-bold">{countCompletadas}</span>
          </div>
          <span className="text-slate-600 text-xs font-medium">Atenciones completadas</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex justify-center items-center">
            <span className="text-slate-900 text-xl font-bold">{atenciones.length}</span>
          </div>
          <span className="text-slate-600 text-xs font-medium">Total histórico</span>
        </div>
      </div>

      {/* Maestro - Detalle */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col lg:flex-row overflow-hidden min-h-[520px]">
        {/* Lista */}
        <div className="w-full lg:w-1/2 xl:w-[45%] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-200 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
            <div>
              <h2 className="text-slate-900 text-base font-bold">Atenciones</h2>
              <span className="text-slate-500 text-xs">Selecciona una atención para ver sus detalles</span>
            </div>
            <div className="p-1 bg-slate-100 rounded-lg flex items-center flex-wrap gap-1">
              {['Todas', 'En proceso', 'Completado', 'Cancelado'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === filter ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col p-2 gap-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-xs text-slate-500">Cargando atenciones...</p>
            ) : filtered.length > 0 ? (
              filtered.map((item) => {
                const f = parseFecha(item.fecha_hora);
                const isSelected = selectedAtencion?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full p-3 rounded-xl border transition-colors flex items-center gap-4 text-left cursor-pointer ${
                      isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="w-12 h-14 bg-white rounded-[10px] border border-slate-200 flex flex-col justify-center items-center shrink-0">
                      <span className="text-slate-900 text-lg font-bold leading-none">{f.day}</span>
                      <span className="text-teal-700 text-[9px] font-semibold mt-1">{f.month}</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-900 text-sm font-semibold truncate">{item.titulo}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase shrink-0 ${getBadgeStyle(item.estado)}`}>
                          {item.estado}
                        </span>
                      </div>
                      <span className="text-slate-600 text-xs truncate">
                        {item.profesional?.nombre_completo || 'Equipo médico'} · {item.profesional?.especialidad || 'Salud'}
                      </span>
                      <span className="text-slate-500 text-[10px] truncate">{f.time} · {item.modalidad}</span>
                    </div>
                    <span className="text-slate-400 text-2xl font-light pl-2 shrink-0">›</span>
                  </button>
                );
              })
            ) : (
              <p className="p-6 text-center text-xs text-slate-500">No hay atenciones en esta categoría.</p>
            )}
          </div>
        </div>

        {/* Detalle */}
        <div className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
          {selectedAtencion ? (
            <>
              <div className="pb-5 border-b border-slate-200 flex flex-col gap-2">
                <span className={`self-start px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${getBadgeStyle(selectedAtencion.estado)}`}>
                  {selectedAtencion.estado}
                </span>
                <h2 className="text-slate-900 text-xl font-bold">{selectedAtencion.titulo}</h2>
                <p className="text-slate-500 text-xs">Código {selectedAtencion.codigo_atencion} · Tipo: {selectedAtencion.tipo}</p>
              </div>

              <div className="py-2 flex flex-col">
                <div className="py-3 border-b border-slate-100">
                  <span className="text-slate-500 text-xs block">Fecha y hora</span>
                  <span className="text-slate-900 text-xs font-semibold capitalize">{parseFecha(selectedAtencion.fecha_hora).full}</span>
                </div>
                <div className="py-3 border-b border-slate-100">
                  <span className="text-slate-500 text-xs block">Profesional</span>
                  <span className="text-slate-900 text-xs font-semibold block">
                    {selectedAtencion.profesional?.nombre_completo || 'Por asignar'}
                  </span>
                  <span className="text-slate-500 text-xs">{selectedAtencion.profesional?.especialidad || ''}</span>
                </div>
                <div className="py-3 border-b border-slate-100">
                  <span className="text-slate-500 text-xs block">Modalidad</span>
                  <span className="text-slate-900 text-xs font-semibold">{selectedAtencion.modalidad}</span>
                </div>
                <div className="py-3">
                  <span className="text-slate-500 text-xs block">Motivo registrado</span>
                  <p className="text-slate-700 text-xs mt-1">{selectedAtencion.motivo_consulta || 'Sin motivo detallado.'}</p>
                </div>
              </div>

              <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <span className="text-slate-900 text-xs font-semibold">Indicaciones y observaciones</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {selectedAtencion.plan_indicaciones || selectedAtencion.observaciones_clinicas || 'Sin indicaciones adicionales.'}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecciona una atención para ver los detalles.
            </div>
          )}
        </div>
      </div>

      {/* Modal Solicitar Atención */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleCrearSolicitud} className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-slate-900 text-lg font-bold">Solicitar atención de seguimiento</h2>
            <p className="text-slate-500 text-xs">
              Esta solicitud se registra en tu ficha y el agendamiento definitivo se coordina con previo aviso.
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Profesional</label>
              <select
                value={solicitud.profesionalId}
                onChange={(e) => setSolicitud({ ...solicitud, profesionalId: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              >
                {profesionales.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombreCompleto} ({p.especialidad || 'Profesional'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Tipo</label>
                <select
                  value={solicitud.tipo}
                  onChange={(e) => setSolicitud({ ...solicitud, tipo: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="control">Control</option>
                  <option value="consulta">Consulta</option>
                  <option value="procedimiento">Procedimiento</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Modalidad</label>
                <select
                  value={solicitud.modalidad}
                  onChange={(e) => setSolicitud({ ...solicitud, modalidad: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Videoconsulta">Videoconsulta</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Asunto de la consulta</label>
              <span className="text-[11px] text-slate-500">Resume brevemente el tipo de control que necesitas.</span>
              <input
                type="text"
                required
                value={solicitud.titulo}
                onChange={(e) => setSolicitud({ ...solicitud, titulo: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Motivo o síntomas</label>
              <span className="text-[11px] text-slate-500">Indica desde cuándo comenzaron y si ya subiste exámenes.</span>
              <textarea
                rows={3}
                required
                value={solicitud.motivoConsulta}
                onChange={(e) => setSolicitud({ ...solicitud, motivoConsulta: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Enviando...' : 'Registrar solicitud'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}