import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META } from '../services/clinicalEngine';

function getPacienteIdFromHash() {
  const parts = (window.location.hash || '').replace(/^#/, '').split('?')[0].split('/');
  const raw = parts[2];
  return raw && !Number.isNaN(Number(raw)) ? Number(raw) : null;
}

export default function ProDetallePaciente({ pacienteId }) {
  const targetId = pacienteId || getPacienteIdFromHash() || 4;
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [seguimiento, setSeguimiento] = useState(null);
  const [atenciones, setAtenciones] = useState([]);
  const [examenes, setExamenes] = useState([]);

  const [showNewAtencion, setShowNewAtencion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nuevaAt, setNuevaAt] = useState({
    tipo: 'consulta',
    modalidad: 'Presencial',
    titulo: '',
    motivoConsulta: '',
    planIndicaciones: '',
    avisoPaciente: true,
  });

  const cargar = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [resU, resSeg, resAts, resExs] = await Promise.allSettled([
        api.getUsuario(targetId),
        api.getSeguimientoPaciente(targetId),
        api.getAtencionesPaciente(targetId),
        api.getExamenesPaciente(targetId),
      ]);

      if (resU.status === 'fulfilled') {
        setPaciente(resU.value);
      } else {
        setPaciente(null);
        setErrorMsg(resU.reason?.message || 'Error consultando el paciente en Supabase.');
      }

      setSeguimiento(resSeg.status === 'fulfilled' ? resSeg.value : null);
      setAtenciones(resAts.status === 'fulfilled' ? resAts.value || [] : []);
      setExamenes(resExs.status === 'fulfilled' ? resExs.value || [] : []);
    } catch (err) {
      setErrorMsg(err.message || 'Error inesperado cargando la ficha.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [targetId]);

  const handleCrearAtencion = async (e) => {
    e.preventDefault();
    if (!nuevaAt.titulo.trim() || !nuevaAt.avisoPaciente) return;
    setSaving(true);
    try {
      const proId = getStoredUser()?.id || 1;
      const nivel = seguimiento?.nivel_semaforo || 'AMARILLO';
      const gravedadLabel =
        nivel === 'URGENCIA_INMEDIATA'
          ? 'Urgencia inmediata'
          : nivel === 'ROJO'
            ? 'Rojo'
            : nivel === 'VERDE'
              ? 'Verde'
              : 'Amarillo';

      await api.crearAtencion({
        paciente_id: targetId,
        profesional_id: proId,
        tipo: nuevaAt.tipo,
        titulo: nuevaAt.titulo.trim(),
        modalidad: nuevaAt.modalidad,
        gravedad: gravedadLabel,
        estado: 'En proceso',
        fecha_hora: new Date().toISOString(),
        motivo_consulta: nuevaAt.motivoConsulta.trim() || null,
        plan_indicaciones: nuevaAt.planIndicaciones.trim() || null,
      });

      setShowNewAtencion(false);
      setNuevaAt({
        tipo: 'consulta',
        modalidad: 'Presencial',
        titulo: '',
        motivoConsulta: '',
        planIndicaciones: '',
        avisoPaciente: true,
      });
      await cargar();
    } catch (err) {
      alert(`Error al crear atención: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-600 text-sm font-medium">Cargando ficha clínica del paciente...</p>
      </main>
    );
  }

  if (!paciente) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex flex-col gap-3 items-center justify-center">
        <p className="text-slate-800 text-sm font-semibold">
          No se encontró el paciente (ID {targetId}).
        </p>
        {errorMsg && (
          <p className="text-red-700 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            Detalle: {errorMsg}
          </p>
        )}
        <a href="#profesional/pacientes" className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-semibold">
          Volver a la lista
        </a>
      </main>
    );
  }

  const nivel = seguimiento?.nivel_semaforo || 'INFORMACION_INSUFICIENTE';
  const meta = PRIORIDAD_META[nivel] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
  const imc =
    paciente.peso_kg && paciente.altura_m
      ? (Number(paciente.peso_kg) / (Number(paciente.altura_m) * Number(paciente.altura_m))).toFixed(1)
      : 'No registrado';
  const nombreSeguro = paciente.nombreCompleto || paciente.nombre_completo || 'Paciente';
  const initials = nombreSeguro
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Ficha clínica del paciente</h1>
          <p className="text-slate-500 text-sm">
            {nombreSeguro} · ID PAC-{String(paciente.id).padStart(4, '0')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#profesional/pacientes"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold"
          >
            Volver a la lista
          </a>
          <a
            href={`#profesional/seguimiento-activo/${paciente.id}`}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 rounded-[10px] text-white text-sm font-semibold"
          >
            Monitor Clínico
          </a>
          <button
            onClick={() => setShowNewAtencion(true)}
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 rounded-[10px] text-white text-sm font-semibold cursor-pointer"
          >
            + Nueva atención
          </button>
        </div>
      </div>

      {/* Tarjeta Resumen */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex justify-center items-center shrink-0">
            <span className="text-red-700 text-base font-bold">{initials}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-slate-900 text-xl font-bold">{nombreSeguro}</h2>
            <p className="text-slate-500 text-xs">
              {paciente.edad ? `${paciente.edad} años` : 'Edad no registrada'} · {paciente.sexo || 'Sexo no registrado'} · RUT {paciente.rut}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${meta.badge}`}>
            {meta.label}
          </span>
          <a
            href={`#profesional/mensajes/${paciente.id}`}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-[10px] text-slate-900 text-xs font-semibold"
          >
            Enviar mensaje
          </a>
        </div>
      </div>

      {paciente.restriccionHidrica && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-xs font-semibold">
          Restricción hídrica activa: {paciente.metaHidricaNota || `Límite máximo ${paciente.metaHidricaMl || 1200} mL/día. No indicar aumento automático de líquidos.`}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">Atenciones totales</span>
          <span className="text-3xl font-bold text-slate-900">{atenciones.length}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">ITU confirmadas · 6 meses</span>
          <span className={`text-3xl font-bold ${(paciente.itu6Meses || 0) >= 2 ? 'text-red-700' : 'text-slate-900'}`}>
            {paciente.itu6Meses ?? 0}
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">ITU confirmadas · 12 meses</span>
          <span className={`text-3xl font-bold ${(paciente.itu12Meses || 0) >= 3 ? 'text-red-700' : 'text-slate-900'}`}>
            {paciente.itu12Meses ?? 0}
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium uppercase">Exámenes cargados</span>
          <span className="text-3xl font-bold text-blue-700">{examenes.length}</span>
        </div>
      </div>

      {/* Datos Personales y de Salud */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
          <h3 className="text-slate-900 text-base font-semibold border-b border-slate-100 pb-2">
            Datos de identificación
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Fecha nacimiento</span>
              <span className="text-slate-900 font-semibold">{paciente.fechaNacimiento || 'No registrada'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Teléfono</span>
              <span className="text-slate-900 font-semibold">{paciente.telefono || 'No registrado'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Comuna</span>
              <span className="text-slate-900 font-semibold">{paciente.comuna || 'No registrada'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 text-xs block">Correo electrónico</span>
              <span className="text-slate-900 font-semibold truncate block">{paciente.email}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Previsión</span>
              <span className="text-slate-900 font-semibold">{paciente.prevision || 'No registrada'}</span>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-slate-500 text-xs block">Contacto de emergencia</span>
              <span className="text-slate-900 font-semibold">{paciente.contactoEmergencia || 'No registrado'}</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
          <h3 className="text-slate-900 text-base font-semibold border-b border-slate-100 pb-2">
            Antecedentes y salud (sin abreviaciones)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Peso</span>
              <span className="text-slate-900 font-semibold">{paciente.peso_kg ? `${paciente.peso_kg} kg` : '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Altura</span>
              <span className="text-slate-900 font-semibold">{paciente.altura_m ? `${paciente.altura_m} m` : '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">IMC</span>
              <span className="text-slate-900 font-semibold">{imc}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Grupo sanguíneo</span>
              <span className="text-slate-900 font-semibold">{paciente.grupoSanguineo || '—'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Alergias conocidas</span>
              <span className="text-slate-900 font-semibold">{paciente.alergias || 'Sin alergias registradas'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block">Medicamentos actuales</span>
              <span className="text-slate-900 font-semibold">{paciente.medicamentosActuales || 'No registrados'}</span>
            </div>
          </div>

          {paciente.enfermedad_renal_detalle && (
            <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
              <strong>Función renal / ERC:</strong> {paciente.enfermedad_renal_detalle}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-slate-500 text-xs font-medium">Factores de riesgo y antecedentes</span>
            <div className="flex flex-wrap gap-2">
              {(paciente.antecedentes?.length ? paciente.antecedentes : ['Sin antecedentes registrados']).map((factor, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Atenciones del Paciente */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200">
          <h3 className="text-slate-900 text-base font-semibold">Atenciones clínicas</h3>
          <span className="text-slate-500 text-xs">{atenciones.length} registros</span>
        </div>

        <div className="flex flex-col">
          {atenciones.length === 0 ? (
            <p className="p-6 text-xs text-slate-500">Este paciente aún no registra atenciones.</p>
          ) : (
            atenciones.map((row, idx) => (
              <div
                key={row.id}
                className={`flex flex-col md:flex-row md:items-center px-6 py-4 gap-2 md:gap-4 hover:bg-slate-50 ${
                  idx !== atenciones.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div className="md:w-24 text-sm font-semibold text-slate-900">{row.codigo_atencion}</div>
                <div className="md:w-28 text-xs text-slate-600 capitalize">{row.tipo}</div>
                <div className="flex-1 text-sm text-slate-800">{row.titulo}</div>
                <div className="md:w-36 text-xs text-slate-500">
                  {new Date(row.fecha_hora).toLocaleString('es-CL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="md:w-28">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                    {row.estado}
                  </span>
                </div>
                <div className="md:w-24 text-right">
                  <a href={`#profesional/detalle-atencion/${row.id}`} className="text-teal-700 hover:underline text-xs font-semibold">
                    Ver detalles
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Nueva Atención */}
      {showNewAtencion && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleCrearAtencion} className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-slate-900 text-lg font-bold">Registrar nueva atención</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Tipo</label>
                <select
                  value={nuevaAt.tipo}
                  onChange={(e) => setNuevaAt({ ...nuevaAt, tipo: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="consulta">Consulta</option>
                  <option value="control">Control</option>
                  <option value="procedimiento">Procedimiento</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Modalidad</label>
                <select
                  value={nuevaAt.modalidad}
                  onChange={(e) => setNuevaAt({ ...nuevaAt, modalidad: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Videoconsulta">Videoconsulta</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Título de la atención</label>
              <input
                type="text"
                required
                value={nuevaAt.titulo}
                onChange={(e) => setNuevaAt({ ...nuevaAt, titulo: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Motivo de consulta</label>
              <textarea
                rows={2}
                value={nuevaAt.motivoConsulta}
                onChange={(e) => setNuevaAt({ ...nuevaAt, motivoConsulta: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Plan e indicaciones</label>
              <textarea
                rows={2}
                value={nuevaAt.planIndicaciones}
                onChange={(e) => setNuevaAt({ ...nuevaAt, planIndicaciones: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={nuevaAt.avisoPaciente}
                onChange={(e) => setNuevaAt({ ...nuevaAt, avisoPaciente: e.target.checked })}
                className="mt-0.5 accent-red-700"
              />
              <span>Confirmo que esta atención se coordina con previo aviso al paciente.</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewAtencion(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !nuevaAt.avisoPaciente}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Guardando...' : 'Guardar atención'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}