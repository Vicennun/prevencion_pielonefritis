import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';

const CATEGORIAS = [
  'Hábitos diarios',
  'Señales de alarma',
  'Tratamiento seguro',
  'Salud sexual',
  'Nutrición / Suplementos',
];

export default function ProPrevenciones() {
  const [activeTab, setActiveTab] = useState('Todas');
  const [search, setSearch] = useState('');
  const [prevenciones, setPrevenciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nueva, setNueva] = useState({
    titulo: '',
    categoria: CATEGORIAS[0],
    descripcion: '',
    estado: 'En revisión',
  });

  const cargar = async () => {
    try {
      const lista = await api.getPrevenciones();
      setPrevenciones(lista || []);
    } catch (err) {
      console.error('Error cargando prevenciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nueva.titulo.trim() || !nueva.descripcion.trim()) return;
    setSaving(true);
    try {
      const autor = getStoredUser()?.nombreCompleto || 'Equipo médico';
      await api.crearPrevencion({
        titulo: nueva.titulo.trim(),
        categoria: nueva.categoria,
        descripcion: nueva.descripcion.trim(),
        autor,
        estado: nueva.estado,
      });
      setNueva({ titulo: '', categoria: CATEGORIAS[0], descripcion: '', estado: 'En revisión' });
      setShowModal(false);
      await cargar();
    } catch (err) {
      alert(`No se pudo crear la indicación: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.actualizarEstadoPrevencion(id, nuevoEstado);
      setPrevenciones((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
    } catch (err) {
      alert(`Error actualizando estado: ${err.message}`);
    }
  };

  const tabMap = {
    Todas: null,
    Activas: 'Activa',
    'En revisión': 'En revisión',
    Borradores: 'Borrador',
  };

  const filtered = prevenciones.filter((item) => {
    const expectedEstado = tabMap[activeTab];
    const matchTab = !expectedEstado || item.estado === expectedEstado;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.titulo.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const getBadgeStyle = (estado) => {
    if (estado === 'Activa') return 'bg-green-100 text-green-700';
    if (estado === 'En revisión') return 'bg-amber-100 text-amber-800';
    return 'bg-slate-200 text-slate-600';
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-blue-700 text-3xl font-bold font-['Inter']">Lista de prevenciones</h1>
          <p className="text-slate-600 text-sm">
            Gestiona la base de conocimientos preventivos. Las pautas en estado «Activa» se muestran inmediatamente a los pacientes.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-3 bg-blue-700 hover:bg-blue-800 transition-colors rounded-[10px] text-white text-sm font-semibold shadow-sm shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-lg leading-none">+</span> Nueva indicación
        </button>
      </div>

      {/* Filtros y Buscador */}
      <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-wrap gap-2 p-1 bg-zinc-200/60 rounded-xl">
          {['Todas', 'Activas', 'En revisión', 'Borradores'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full lg:w-96 px-4 py-2.5 bg-white rounded-xl border border-slate-300 flex items-center shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar indicación o categoría..."
            className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Grid de Tarjetas */}
      {loading ? (
        <p className="text-xs text-slate-500">Cargando base de conocimientos...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-500">
          No se encontraron guías preventivas en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-start gap-3 bg-slate-50/50">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.categoria}</span>
                  <h3 className="text-slate-900 text-base font-semibold leading-tight">{item.titulo}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${getBadgeStyle(item.estado)}`}>
                  {item.estado}
                </span>
              </div>

              <div className="px-5 py-4 flex-1">
                <p className="text-slate-600 text-sm leading-relaxed">{item.descripcion}</p>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 bg-white flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{item.autor}</span>
                  <span>{item.fecha}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.estado !== 'Activa' && (
                    <button
                      onClick={() => handleCambiarEstado(item.id, 'Activa')}
                      className="flex-1 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Aprobar y activar
                    </button>
                  )}
                  {item.estado !== 'En revisión' && (
                    <button
                      onClick={() => handleCambiarEstado(item.id, 'En revisión')}
                      className="flex-1 py-2 bg-white hover:bg-amber-50 border border-amber-400 text-amber-800 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Pedir revisión
                    </button>
                  )}
                  {item.estado !== 'Borrador' && (
                    <button
                      onClick={() => handleCambiarEstado(item.id, 'Borrador')}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Ocultar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Indicación */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleCrear} className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-slate-900 text-lg font-bold">Nueva indicación preventiva</h2>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Título de la pauta</label>
              <span className="text-[11px] text-slate-500">Escribe un título claro y directo para el paciente.</span>
              <input
                type="text"
                required
                value={nueva.titulo}
                onChange={(e) => setNueva({ ...nueva, titulo: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Categoría</label>
                <select
                  value={nueva.categoria}
                  onChange={(e) => setNueva({ ...nueva, categoria: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Estado inicial</label>
                <select
                  value={nueva.estado}
                  onChange={(e) => setNueva({ ...nueva, estado: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Activa">Activa (visible al paciente)</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Borrador">Borrador</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Descripción clínica</label>
              <span className="text-[11px] text-slate-500">
                Evita metas universales de líquidos o sugerencias automáticas de antibióticos.
              </span>
              <textarea
                rows={4}
                required
                value={nueva.descripcion}
                onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
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
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Guardando...' : 'Guardar indicación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}