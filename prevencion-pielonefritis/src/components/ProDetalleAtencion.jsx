import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';

export default function ProDetalleAtencion({ atencionId }) {
  const [atencion, setAtencion] = useState(null);
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      let data = null;
      if (atencionId) {
        data = await api.getAtencionById(atencionId);
      } else {
        const todas = await api.getTodasAtenciones();
        data = todas?.[0] || null;
      }
      setAtencion(data);

      if (data?.paciente_id) {
        const exs = await api.getExamenesPaciente(data.paciente_id);
        setExamenes(exs || []);
      }
    } catch (err) {
      console.error('Error cargando detalle de atención:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [atencionId]);

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!atencion) return;
    setUpdating(true);
    setFeedback('');
    try {
      const updated = await api.actualizarEstadoAtencion(atencion.id, nuevoEstado);
      setAtencion((prev) => ({ ...prev, estado: updated.estado }));
      setFeedback(`Estado actualizado a "${nuevoEstado}".`);
    } catch (err) {
      setFeedback(`Error al actualizar estado: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleEnviarRecordatorio = async () => {
    if (!atencion) return;
    setUpdating(true);
    setFeedback('');
    try {
      const proId = getStoredUser()?.id || 1;
      await api.crearRecordatorio({
        paciente_id: atencion.paciente_id,
        profesional_id: proId,
        tipo: 'enviado',
        titulo: `Seguimiento de atención ${atencion.codigo_atencion}`,
        descripcion:
          atencion.plan_indicaciones ||
          'Tu equipo médico solicitó confirmar evolución de síntomas y revisar resultados pendientes.',
        frecuencia: 'Puntual',
        prioridad: 'Alta',
        fecha_programada: 'Hoy',
        activo: true,
      });
      setFeedback('Aviso de seguimiento enviado al panel del paciente.');
    } catch (err) {
      setFeedback(`No se pudo enviar el aviso: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-600 text-sm font-medium">Cargando detalle de atención...</p>
      </main>
    );
  }

  if (!atencion) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex flex-col gap-3 items-center justify-center">
        <p className="text-slate-700 text-sm font-semibold">No se encontró la atención solicitada.</p>
        <a href="#profesional/historial" className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-semibold">
          Volver al historial
        </a>
      </main>
    );
  }

  const pac = atencion.paciente || {};
  const pro = atencion.profesional || {};
  const getInitials = (name = '') =>
    name
      .replace(/^(Dr\.|Dra\.)\s*/i, '')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const signosVitales = [
    { label: 'Temperatura', value: atencion.temperatura || 'No registrada' },
    { label: 'Presión arterial', value: atencion.presion_arterial || 'No registrada' },
    { label: 'Frecuencia cardíaca', value: atencion.frecuencia_cardiaca || 'No registrada' },
    { label: 'Saturación', value: atencion.saturacion || 'No registrada' },
  ];

  const esAltaPrioridad =
    (atencion.gravedad || '').toLowerCase().includes('rojo') ||
    (atencion.gravedad || '').toLowerCase().includes('urgencia') ||
    (atencion.gravedad || '').toLowerCase().includes('extremo');

  const getExamBadge = (estado = '') => {
    if (estado.startsWith('Revisado')) return 'bg-green-100 text-green-700';
    if (estado.startsWith('Resultado disponible')) return 'bg-amber-100 text-amber-800';
    if (estado.startsWith('Muestra rechazada')) return 'bg-red-100 text-red-700';
    return 'bg-slate-200 text-slate-600';
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">{atencion.titulo}</h1>
          <p className="text-slate-600 text-sm">
            Atención {atencion.codigo_atencion} · <span className="capitalize">{atencion.tipo}</span> · {pac.nombre_completo || 'Paciente'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="#profesional/historial"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold"
          >
            Volver al historial
          </a>
          {atencion.estado !== 'Completado' && (
            <button
              disabled={updating}
              onClick={() => handleCambiarEstado('Completado')}
              className="px-4 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 rounded-[10px] text-white text-sm font-semibold cursor-pointer"
            >
              Completar atención
            </button>
          )}
          {atencion.estado === 'En proceso' && (
            <button
              disabled={updating}
              onClick={() => handleCambiarEstado('Cancelado')}
              className="px-4 py-2.5 bg-white hover:bg-red-50 border border-red-300 rounded-[10px] text-red-700 text-sm font-semibold cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-green-50 border border-green-300 rounded-xl text-green-800 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Banner de Prioridad */}
      {esAltaPrioridad && (
        <div className="w-full px-5 py-3.5 bg-red-100 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 mt-1.5 bg-red-700 rounded-full shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-red-800 text-sm font-bold">Atención de prioridad clínica alta ({atencion.gravedad})</span>
              <span className="text-slate-700 text-xs">
                Episodios registrados en 12 meses: {pac.itu_12_meses ?? 0}. Revisa la evolución en el Monitor Clínico.
              </span>
            </div>
          </div>
          <button
            disabled={updating}
            onClick={handleEnviarRecordatorio}
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 rounded-[10px] text-white text-xs font-semibold shrink-0 cursor-pointer"
          >
            Enviar aviso al paciente
          </button>
        </div>
      )}

      {/* Resumen Rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Prioridad</span>
          <span className="text-red-700 text-xl lg:text-2xl font-bold">{atencion.gravedad}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Estado</span>
          <span className="text-blue-700 text-xl lg:text-2xl font-bold">{atencion.estado}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Modalidad</span>
          <span className="text-slate-900 text-xl lg:text-2xl font-bold">{atencion.modalidad}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Fecha y hora</span>
          <span className="text-slate-900 text-base lg:text-lg font-bold">
            {new Date(atencion.fecha_hora).toLocaleString('es-CL', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5">
          <h2 className="text-slate-900 text-base font-bold">Información clínica</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {signosVitales.map((signo, idx) => (
              <div key={idx} className="px-3.5 py-3 bg-slate-50 rounded-xl flex flex-col gap-0.5 border border-slate-100">
                <span className="text-slate-500 text-xs font-medium">{signo.label}</span>
                <span className="text-slate-900 text-sm font-bold">{signo.value}</span>
              </div>
            ))}
          </div>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold">Motivo de consulta</span>
            <p className="text-slate-700 text-sm leading-relaxed">
              {atencion.motivo_consulta || 'Sin motivo registrado.'}
            </p>
          </div>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-2">
            <span className="text-slate-500 text-xs font-semibold">Síntomas reportados</span>
            <div className="flex flex-wrap gap-2">
              {atencion.sintomas_reportados?.length ? (
                atencion.sintomas_reportados.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs">Sin síntomas etiquetados.</span>
              )}
            </div>
          </div>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold">Observaciones clínicas</span>
            <p className="text-slate-700 text-sm leading-relaxed">
              {atencion.observaciones_clinicas || 'Sin observaciones adicionales.'}
            </p>
          </div>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold">Plan e indicaciones</span>
            <p className="text-slate-700 text-sm leading-relaxed">
              {atencion.plan_indicaciones || 'Sin plan documentado.'}
            </p>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h3 className="text-slate-900 text-base font-bold">Paciente</h3>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-100 rounded-full flex justify-center items-center shrink-0">
                <span className="text-red-700 text-sm font-bold">{getInitials(pac.nombre_completo)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 text-sm font-semibold">{pac.nombre_completo || 'Paciente'}</span>
                <span className="text-slate-500 text-xs">
                  {pac.edad ? `${pac.edad} años` : 'Edad s/d'} · {pac.sexo || '—'} · PAC-{String(atencion.paciente_id).padStart(4, '0')}
                </span>
              </div>
            </div>
            <div className="flex gap-4 pt-1">
              <a
                href={`#profesional/detalle-paciente/${atencion.paciente_id}`}
                className="text-teal-700 hover:underline text-xs font-semibold"
              >
                Ver ficha completa
              </a>
              <a
                href={`#profesional/seguimiento-activo/${atencion.paciente_id}`}
                className="text-red-700 hover:underline text-xs font-semibold"
              >
                Ver Monitor Clínico
              </a>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h3 className="text-slate-900 text-base font-bold">Profesional a cargo</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex justify-center items-center shrink-0">
                <span className="text-red-700 text-xs font-bold">{getInitials(pro.nombre_completo)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 text-sm font-semibold">{pro.nombre_completo || 'Equipo médico'}</span>
                <span className="text-slate-500 text-xs">{pro.especialidad || 'Profesional de salud'}</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h3 className="text-slate-900 text-base font-bold">Exámenes del paciente</h3>
            {examenes.length === 0 ? (
              <p className="text-xs text-slate-500">No hay exámenes cargados para este paciente.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {examenes.map((ex, idx) => (
                  <div key={ex.id} className="flex flex-col">
                    {idx !== 0 && <hr className="border-slate-200 mb-3" />}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-900 text-sm font-semibold truncate">
                        {ex.nombre_archivo || ex.tipo_examen}
                      </span>
                      <span className={`self-start px-2 py-0.5 rounded-full text-[10px] font-bold ${getExamBadge(ex.estado)}`}>
                        {ex.estado}
                      </span>
                      <a
                        href={`#profesional/revision-examen/${ex.id}`}
                        className="text-red-700 hover:underline text-xs font-semibold self-start"
                      >
                        Abrir en visor clínico ›
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}