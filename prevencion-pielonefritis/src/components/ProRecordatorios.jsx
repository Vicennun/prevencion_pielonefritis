import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';

export default function ProRecordatorios() {
  const [activeTab, setActiveTab] = useState('Mis tareas');
  const [recordatorios, setRecordatorios] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [examenesPendientes, setExamenesPendientes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // Modal unificado ('tarea' o 'enviado')
  const [modalMode, setModalMode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    pacienteId: '',
    titulo: '',
    descripcion: '',
    prioridad: 'Alta',
    frecuencia: 'Puntual',
    fechaProgramada: '',
  });

  const cargar = async () => {
    try {
      const [recs, pacs, exs] = await Promise.all([
        api.getTodosRecordatorios(),
        api.getPacientes(),
        api.getExamenesPendientes(),
      ]);
      setRecordatorios(recs || []);
      setPacientes(pacs || []);
      setExamenesPendientes((exs || []).length);
      if (pacs?.length && !form.pacienteId) {
        setForm((p) => ({ ...p, pacienteId: String(pacs[0].id) }));
      }
    } catch (err) {
      console.error('Error cargando Centro de Comando:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCompletar = async (id) => {
    try {
      await api.completarRecordatorio(id);
      setRecordatorios((prev) => prev.filter((r) => r.id !== id));
      setFeedback('Tarea marcada como completada.');
    } catch (err) {
      alert(`Error al completar: ${err.message}`);
    }
  };

  const handleEnviarDesdeAlerta = async (alerta) => {
    if (!alerta.paciente_id) return;
    try {
      const proId = getStoredUser()?.id || 1;
      await api.crearRecordatorio({
        paciente_id: alerta.paciente_id,
        profesional_id: proId,
        tipo: 'enviado',
        titulo: `Seguimiento solicitado: ${alerta.titulo}`,
        descripcion: 'Por favor registra tus síntomas actuales y contacta al equipo de salud.',
        frecuencia: 'Alarma',
        prioridad: 'Alta',
        fecha_programada: 'Hoy',
        activo: true,
      });
      setFeedback(`Recordatorio enviado a ${alerta.paciente?.nombre_completo || 'el paciente'}.`);
      await cargar();
    } catch (err) {
      alert(`No se pudo enviar: ${err.message}`);
    }
  };

  const handleGuardarModal = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    setSaving(true);
    try {
      const proId = getStoredUser()?.id || 1;
      await api.crearRecordatorio({
        paciente_id: form.pacienteId ? Number(form.pacienteId) : null,
        profesional_id: proId,
        tipo: modalMode === 'enviado' ? 'enviado' : 'tarea',
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        prioridad: form.prioridad,
        frecuencia: form.frecuencia,
        fecha_programada: form.fechaProgramada.trim() || 'Hoy',
        activo: true,
      });
      setModalMode(null);
      setForm((p) => ({ ...p, titulo: '', descripcion: '', fechaProgramada: '' }));
      setFeedback(modalMode === 'enviado' ? 'Recordatorio enviado al paciente.' : 'Tarea clínica creada.');
      await cargar();
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const misTareas = recordatorios.filter((r) => r.tipo === 'tarea' || r.tipo === 'examen');
  const alertas = recordatorios.filter((r) => r.tipo === 'alerta');
  const enviados = recordatorios.filter((r) => r.tipo === 'enviado' || r.tipo === 'cuidado');

  const filteredTasks =
    activeTab === 'Mis tareas' ? misTareas : activeTab === 'Alertas' ? alertas : enviados;

  const kpis = [
    { label: 'Tareas pendientes', value: String(misTareas.length), color: 'text-red-700' },
    { label: 'Exámenes por revisar', value: String(examenesPendientes), color: 'text-amber-600' },
    { label: 'Alertas activas', value: String(alertas.length), color: 'text-red-700' },
    { label: 'Recordatorios a pacientes', value: String(enviados.length), color: 'text-slate-900' },
  ];

  const getPriorityStyle = (prioridad) => {
    if (prioridad === 'Alta') return 'bg-red-100 text-red-700';
    if (prioridad === 'Media') return 'bg-amber-100 text-amber-800';
    return 'bg-slate-200 text-slate-600';
  };

  const getTaskIcon = (tipo) => {
    if (tipo === 'examen') return 'LAB';
    if (tipo === 'alerta') return '!';
    if (tipo === 'enviado' || tipo === 'cuidado') return 'ENV';
    return 'TAR';
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-blue-800 text-3xl font-bold font-['Inter']">Centro de Comando Clínico</h1>
          <p className="text-slate-600 text-sm">
            Gestiona tus tareas, revisa alertas clínicas y envía recordatorios directos a tus pacientes.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setModalMode('tarea')}
            className="flex-1 sm:flex-none px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 text-sm font-semibold shadow-sm cursor-pointer"
          >
            + Crear mi tarea
          </button>
          <button
            onClick={() => setModalMode('enviado')}
            className="flex-1 sm:flex-none px-4 py-3 bg-blue-700 hover:bg-blue-800 rounded-[10px] text-white text-sm font-semibold shadow-sm cursor-pointer"
          >
            Enviar a paciente
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-green-50 border border-green-300 rounded-xl text-green-800 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
            <span className="text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide">{kpi.label}</span>
            <span className={`text-2xl sm:text-3xl font-bold ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs y Lista */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm flex-1">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {[
            ['Mis tareas', misTareas.length],
            ['Alertas', alertas.length],
            ['Enviados', enviados.length],
          ].map(([tab, count]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-700 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab} ({count})
            </button>
          ))}
        </div>

        <div className="flex flex-col p-3 gap-2.5 overflow-y-auto">
          {loading ? (
            <p className="p-6 text-xs text-slate-500">Cargando tareas y alertas...</p>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex justify-center items-center shrink-0 border border-slate-200 text-xs font-bold text-slate-700">
                    {getTaskIcon(task.tipo)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-slate-900 text-sm font-bold">{task.titulo}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getPriorityStyle(task.prioridad)}`}>
                        {task.prioridad}
                      </span>
                    </div>
                    <span className="text-slate-600 text-xs font-semibold">
                      Paciente: <span className="font-normal">{task.paciente?.nombre_completo || 'General'}</span>
                      {' · '}
                      <span className="font-normal text-slate-500">{task.fecha_programada || task.frecuencia}</span>
                    </span>
                    {task.descripcion && (
                      <p className="text-slate-500 text-xs max-w-2xl leading-relaxed">{task.descripcion}</p>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-wrap justify-end gap-2 shrink-0">
                  {task.tipo === 'examen' && (
                    <a
                      href="#profesional/revision-examen"
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Revisar examen
                    </a>
                  )}
                  {activeTab === 'Alertas' && task.paciente_id && (
                    <button
                      onClick={() => handleEnviarDesdeAlerta(task)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Enviar recordatorio
                    </button>
                  )}
                  <button
                    onClick={() => handleCompletar(task.id)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Marcar listo
                  </button>
                  {task.paciente_id && (
                    <a
                      href={`#profesional/detalle-paciente/${task.paciente_id}`}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-teal-700 rounded-lg text-xs font-semibold"
                    >
                      Ver ficha
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="text-sm font-semibold">No hay elementos pendientes en esta sección</p>
              <p className="text-xs mt-1">Todo al día por aquí.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear Tarea / Enviar Recordatorio */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleGuardarModal} className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-slate-900 text-lg font-bold">
              {modalMode === 'enviado' ? 'Enviar recordatorio al paciente' : 'Crear tarea clínica'}
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Paciente asociado</label>
              <select
                value={form.pacienteId}
                onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombreCompleto}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Título</label>
              <span className="text-[11px] text-slate-500">
                {modalMode === 'enviado'
                  ? 'Ej. Subir resultado de urocultivo o registrar temperatura de hoy'
                  : 'Ej. Llamar para verificar tolerancia al antibiótico'}
              </span>
              <input
                type="text"
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Prioridad</label>
                <select
                  value={form.prioridad}
                  onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Horario / plazo</label>
                <input
                  type="text"
                  value={form.fechaProgramada}
                  onChange={(e) => setForm({ ...form, fechaProgramada: e.target.value })}
                  placeholder="Ej. Hoy · 18:00"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Descripción</label>
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Guardando...' : modalMode === 'enviado' ? 'Enviar recordatorio' : 'Crear tarea'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}