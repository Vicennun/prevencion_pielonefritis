import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';

export default function ProHistorial() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [atenciones, setAtenciones] = useState([]);
  const [noLeidos, setNoLeidos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const proId = getStoredUser()?.id || 1;
        const [ats, msgs] = await Promise.all([
          api.getTodasAtenciones(),
          api.getMensajesUsuario(proId),
        ]);
        setAtenciones(ats || []);
        const unread = (msgs || []).filter((m) => m.destinatario_id === proId && !m.leido).length;
        setNoLeidos(unread);
      } catch (err) {
        console.error('Error cargando historial de atenciones:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const countEstado = (estado) => atenciones.filter((a) => a.estado === estado).length;
  const completadas = countEstado('Completado');
  const pctCompletadas = atenciones.length > 0 ? `${Math.round((completadas / atenciones.length) * 100)}%` : '0%';

  const kpis = [
    { label: 'Atenciones históricas', value: String(atenciones.length), valueColor: 'text-slate-900' },
    { label: 'Atenciones completadas', value: pctCompletadas, valueColor: 'text-green-700' },
    { label: 'Atenciones en proceso', value: String(countEstado('En proceso')), valueColor: 'text-blue-700' },
    { label: 'Mensajes sin leer', value: String(noLeidos), valueColor: 'text-red-700' },
  ];

  const filters = [
    { label: 'Todos', count: atenciones.length },
    { label: 'En proceso', count: countEstado('En proceso') },
    { label: 'Completado', count: completadas },
    { label: 'Cancelado', count: countEstado('Cancelado') },
    { label: 'Reagendado', count: countEstado('Reagendado') },
  ];

  const filtered = atenciones.filter((row) => {
    const matchEstado = activeFilter === 'Todos' || row.estado === activeFilter;
    const q = search.trim().toLowerCase();
    const pacName = (row.paciente?.nombre_completo || '').toLowerCase();
    const codigo = (row.codigo_atencion || '').toLowerCase();
    const titulo = (row.titulo || '').toLowerCase();
    const matchSearch = !q || pacName.includes(q) || codigo.includes(q) || titulo.includes(q);
    return matchEstado && matchSearch;
  });

  const getGravedadClasses = (gravedad = '') => {
    const g = gravedad.toLowerCase();
    if (g.includes('urgencia')) return 'bg-blue-700 text-white';
    if (g.includes('rojo') || g.includes('extremo')) return 'bg-red-100 text-red-700';
    if (g.includes('amarillo') || g.includes('alto') || g.includes('moderado')) return 'bg-amber-100 text-amber-800';
    if (g.includes('verde') || g.includes('bajo')) return 'bg-green-100 text-green-700';
    return 'bg-slate-200 text-slate-600';
  };

  const getEstadoClasses = (estado = '') => {
    if (estado === 'En proceso') return 'bg-blue-100 text-blue-700';
    if (estado === 'Completado') return 'bg-green-100 text-green-700';
    if (estado === 'Reagendado') return 'bg-amber-100 text-amber-800';
    return 'bg-slate-200 text-slate-600';
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-blue-800 text-3xl font-bold font-['Inter']">Historial de atenciones</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Administra, gestiona y revisa las atenciones clínicas registradas en la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#profesional/mensajes"
            className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold shrink-0"
          >
            Ir a mensajería
          </a>
          <a
            href="#profesional/pacientes"
            className="px-4 py-3 bg-blue-700 hover:bg-blue-800 transition-colors rounded-[10px] text-white text-sm font-semibold shrink-0"
          >
            Ver pacientes
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">{kpi.label}</span>
            <span className={`text-3xl font-bold ${kpi.valueColor}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Filtros y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-3.5 py-2 rounded-full border transition-colors text-xs font-semibold cursor-pointer ${
                activeFilter === filter.label
                  ? 'bg-blue-700 text-white border-transparent'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter.label} · {filter.count}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80 px-3.5 py-2.5 bg-white rounded-full border border-slate-300 flex items-center shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por paciente, código o asunto…"
            className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="hidden md:flex items-center px-6 py-3 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
          <div className="w-24">Código</div>
          <div className="flex-1 min-w-[160px]">Paciente / Atención</div>
          <div className="w-28">Tipo</div>
          <div className="w-32">Prioridad</div>
          <div className="w-36">Fecha / hora</div>
          <div className="w-28">Estado</div>
          <div className="w-24 text-right">Acción</div>
        </div>

        <div className="flex flex-col">
          {loading ? (
            <p className="p-6 text-xs text-slate-500">Cargando historial...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">No hay atenciones que coincidan con el filtro.</p>
          ) : (
            filtered.map((row, index) => (
              <div
                key={row.id}
                className={`flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 gap-2 md:gap-0 hover:bg-slate-50 transition-colors ${
                  index !== filtered.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div className="w-full md:w-24 text-xs md:text-sm font-semibold text-slate-900">
                  <span className="md:hidden text-slate-500">Código: </span>
                  {row.codigo_atencion}
                </div>

                <div className="flex-1 min-w-[160px] pr-3">
                  <span className="text-slate-900 text-sm font-semibold block">
                    {row.paciente?.nombre_completo || 'Paciente'}
                  </span>
                  <span className="text-slate-500 text-xs block truncate">{row.titulo}</span>
                </div>

                <div className="w-full md:w-28 text-slate-600 text-xs capitalize">
                  <span className="md:hidden font-semibold">Tipo: </span>
                  {row.tipo}
                </div>

                <div className="w-full md:w-32">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getGravedadClasses(row.gravedad)}`}>
                    {row.gravedad}
                  </span>
                </div>

                <div className="w-full md:w-36 text-slate-600 text-xs">
                  {new Date(row.fecha_hora).toLocaleString('es-CL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="w-full md:w-28">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getEstadoClasses(row.estado)}`}>
                    {row.estado}
                  </span>
                </div>

                <div className="w-full md:w-24 flex justify-end">
                  <a
                    href={`#profesional/detalle-atencion/${row.id}`}
                    className="text-teal-700 hover:text-teal-800 text-xs font-semibold hover:underline"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}