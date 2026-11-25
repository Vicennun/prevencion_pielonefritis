import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PRIORIDAD_META, ordenarPorPrioridadClinica } from '../services/clinicalEngine';

export default function ProPacientes() {
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showNewModal, setShowNewModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nuevoPac, setNuevoPac] = useState({
    nombreCompleto: '',
    rut: '',
    email: '',
    edad: '',
    sexo: 'Femenino',
    telefono: '',
    antecedentesTexto: '',
  });

  const cargar = async () => {
    try {
      const [pacientes, seguimientos, atenciones] = await Promise.all([
        api.getPacientes(),
        api.getSeguimientos(),
        api.getTodasAtenciones(),
      ]);

      const segByPac = new Map(seguimientos.map((s) => [s.paciente_id, s]));
      const atByPac = new Map();
      (atenciones || []).forEach((a) => {
        if (!atByPac.has(a.paciente_id)) atByPac.set(a.paciente_id, a);
      });

      const combinados = (pacientes || []).map((p) => {
        const seg = segByPac.get(p.id);
        const ultAt = atByPac.get(p.id);
        return {
          ...p,
          nivelSemaforo: seg?.nivel_semaforo || 'INFORMACION_INSUFICIENTE',
          diagnostico: seg?.diagnostico || 'Sin seguimiento activo',
          alertaMetabolica: seg?.alerta_metabolica || 'NINGUNA',
          ultimoCheckin: seg?.ultimo_checkin_at || ultAt?.fecha_hora || p.created_at,
          estadoAtencion: ultAt?.estado || (seg ? 'En proceso' : 'Sin atenciones'),
        };
      });

      setRows(ordenarPorPrioridadClinica(combinados, (item) => item.nivelSemaforo));
    } catch (err) {
      console.error('Error cargando pacientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrearPaciente = async (e) => {
    e.preventDefault();
    if (!nuevoPac.nombreCompleto.trim() || !nuevoPac.email.trim()) return;
    setSaving(true);
    try {
      const creado = await api.registrar({
        nombreCompleto: nuevoPac.nombreCompleto,
        email: nuevoPac.email,
        password: '12345678',
        rol: 'PACIENTE',
      });
      const antArray = nuevoPac.antecedentesTexto
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.actualizarUsuario(creado.id, {
        rut: nuevoPac.rut.trim() || creado.rut,
        edad: nuevoPac.edad ? Number(nuevoPac.edad) : null,
        sexo: nuevoPac.sexo,
        telefono: nuevoPac.telefono.trim() || null,
        antecedentes: antArray.length ? antArray : ['Sin antecedentes de riesgo'],
      });

      setShowNewModal(false);
      setNuevoPac({ nombreCompleto: '', rut: '', email: '', edad: '', sexo: 'Femenino', telefono: '', antecedentesTexto: '' });
      await cargar();
    } catch (err) {
      alert(`No se pudo crear el paciente: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Exportación CSV con nombres completos (sin abreviaciones)
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nombre completo',
      'RUT',
      'Edad',
      'Sexo',
      'Prioridad clinica',
      'Antecedentes (sin abreviaciones)',
      'ITU 6 meses',
      'ITU 12 meses',
      'Restriccion hidrica',
      'Estado atencion',
    ];
    const csvRows = [
      headers.join(';'),
      ...filteredRows.map((r) => {
        const meta = PRIORIDAD_META[r.nivelSemaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
        const ants = (r.antecedentes || []).join(' | ').replace(/;/g, ',');
        return [
          `PAC-${String(r.id).padStart(4, '0')}`,
          r.nombreCompleto,
          r.rut,
          r.edad ?? 'No registrada',
          r.sexo || 'No registrado',
          meta.label,
          ants || 'Sin antecedentes registrados',
          r.itu6Meses ?? 0,
          r.itu12Meses ?? 0,
          r.restriccionHidrica ? 'Si (seguir limite medico)' : 'No',
          r.estadoAtencion,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(';');
      }),
    ];

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pacientes_cero_nefritis_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const countByLevel = (level) => rows.filter((r) => r.nivelSemaforo === level).length;
  const urgenciasYRojo = countByLevel('URGENCIA_INMEDIATA') + countByLevel('ROJO');

  const filters = [
    { id: 'TODOS', label: 'Todos', count: rows.length },
    { id: 'URGENCIA_INMEDIATA', label: 'Urgencias inmediatas', count: countByLevel('URGENCIA_INMEDIATA') },
    { id: 'ROJO', label: 'Valoración hoy (Rojo)', count: countByLevel('ROJO') },
    { id: 'AMARILLO', label: 'Vigilar (Amarillo)', count: countByLevel('AMARILLO') },
    { id: 'INFORMACION_INSUFICIENTE', label: 'Info insuficiente', count: countByLevel('INFORMACION_INSUFICIENTE') },
    { id: 'VERDE', label: 'Sin señales (Verde)', count: countByLevel('VERDE') },
  ];

  const filteredRows = rows.filter((r) => {
    const matchLevel = activeFilter === 'TODOS' || r.nivelSemaforo === activeFilter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      r.nombreCompleto.toLowerCase().includes(q) ||
      (r.rut || '').toLowerCase().includes(q) ||
      (r.antecedentes || []).some((a) => a.toLowerCase().includes(q));
    return matchLevel && matchSearch;
  });

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Panel de pacientes</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            {rows.length} pacientes registrados · ordenados automáticamente por prioridad clínica determinista
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold cursor-pointer"
          >
            Exportar CSV
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-3 bg-red-700 hover:bg-red-800 transition-colors rounded-[10px] text-white text-sm font-semibold cursor-pointer"
          >
            + Nuevo paciente
          </button>
        </div>
      </div>

      {/* Banner de Alerta Prioritaria */}
      {urgenciasYRojo > 0 && (
        <div className="w-full px-5 py-3.5 bg-red-100 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-2.5 h-2.5 mt-1.5 bg-red-700 rounded-full shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-red-800 text-sm font-bold">
                {urgenciasYRojo} paciente(s) requieren Urgencia Inmediata o Valoración Presencial Hoy
              </span>
              <span className="text-slate-700 text-xs">
                Aparecen automáticamente en la parte superior de la tabla según las reglas clínicas validadas.
              </span>
            </div>
          </div>
          <a
            href="#profesional/seguimiento-activo"
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 transition-colors rounded-[10px] text-white text-xs font-semibold shrink-0"
          >
            Ir al Monitor Clínico
          </a>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">Pacientes asignados</span>
          <span className="text-3xl font-bold text-slate-900">{rows.length}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">Urgencias inmediatas</span>
          <span className="text-3xl font-bold text-red-700">{countByLevel('URGENCIA_INMEDIATA')}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">Valoración hoy (Rojo)</span>
          <span className="text-3xl font-bold text-red-600">{countByLevel('ROJO')}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">Vigilar (Amarillo)</span>
          <span className="text-3xl font-bold text-amber-600">{countByLevel('AMARILLO')}</span>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-2 rounded-full border transition-colors text-xs font-semibold cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-red-700 text-white border-transparent'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label} · {f.count}
            </button>
          ))}
        </div>

        <div className="w-full lg:w-80 px-3.5 py-2.5 bg-white rounded-full border border-slate-300 flex items-center shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, RUT o antecedente…"
            className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="hidden md:flex items-center px-6 py-3 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
          <div className="flex-1 min-w-[200px]">Paciente y antecedentes</div>
          <div className="w-16">Edad</div>
          <div className="w-44">Prioridad clínica</div>
          <div className="w-32">Último registro</div>
          <div className="w-40 text-right">Acciones</div>
        </div>

        <div className="flex flex-col">
          {loading ? (
            <p className="p-6 text-xs text-slate-500">Cargando lista de pacientes...</p>
          ) : filteredRows.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">No se encontraron pacientes con ese filtro.</p>
          ) : (
            filteredRows.map((row, idx) => {
              const meta = PRIORIDAD_META[row.nivelSemaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
              return (
                <div
                  key={row.id}
                  className={`flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 gap-3 md:gap-0 hover:bg-slate-50 transition-colors ${
                    idx !== filteredRows.length - 1 ? 'border-b border-slate-200' : ''
                  }`}
                >
                  <div className="flex-1 min-w-[200px] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex justify-center items-center shrink-0 text-xs font-bold">
                      {getInitials(row.nombreCompleto)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-900 text-sm font-semibold">{row.nombreCompleto}</span>
                      <span className="text-slate-500 text-[11px]">
                        {(row.antecedentes?.length ? row.antecedentes : ['Sin antecedentes registrados']).join(' · ')}
                      </span>
                      {row.alertaMetabolica && row.alertaMetabolica !== 'NINGUNA' && (
                        <span className="self-start mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                          Alerta metabólica activa
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-16 text-slate-600 text-sm">
                    <span className="md:hidden font-semibold">Edad: </span>
                    {row.edad ?? '—'}
                  </div>

                  <div className="w-full md:w-44">
                    <span className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-bold ${meta.badge}`}>
                      {meta.short}
                    </span>
                  </div>

                  <div className="w-full md:w-32 text-slate-500 text-xs">
                    {row.ultimoCheckin ? new Date(row.ultimoCheckin).toLocaleDateString('es-CL') : '—'}
                  </div>

                  <div className="w-full md:w-40 flex justify-end gap-3 text-xs font-semibold">
                    <a
                      href={`#profesional/seguimiento-activo/${row.id}`}
                      className="text-red-700 hover:underline"
                    >
                      Monitor
                    </a>
                    <a
                      href={`#profesional/detalle-paciente/${row.id}`}
                      className="text-teal-700 hover:underline"
                    >
                      Ver ficha
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Nuevo Paciente */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleCrearPaciente} className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-3.5 shadow-xl">
            <h2 className="text-slate-900 text-lg font-bold">Ingresar nuevo paciente</h2>
            <p className="text-slate-500 text-xs">Se creará con clave temporal 12345678 para acceso a la plataforma.</p>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Nombre completo</label>
              <input
                type="text"
                required
                value={nuevoPac.nombreCompleto}
                onChange={(e) => setNuevoPac({ ...nuevoPac, nombreCompleto: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">RUT</label>
                <input
                  type="text"
                  value={nuevoPac.rut}
                  onChange={(e) => setNuevoPac({ ...nuevoPac, rut: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Edad</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={nuevoPac.edad}
                  onChange={(e) => setNuevoPac({ ...nuevoPac, edad: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={nuevoPac.email}
                  onChange={(e) => setNuevoPac({ ...nuevoPac, email: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Sexo</label>
                <select
                  value={nuevoPac.sexo}
                  onChange={(e) => setNuevoPac({ ...nuevoPac, sexo: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Antecedentes (en texto completo, separados por coma)</label>
              <span className="text-[11px] text-slate-500">Evitar abreviaciones. Ej.: Diabetes mellitus tipo 2, Antecedente de cálculos renales</span>
              <input
                type="text"
                value={nuevoPac.antecedentesTexto}
                onChange={(e) => setNuevoPac({ ...nuevoPac, antecedentesTexto: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Guardando...' : 'Crear paciente'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}