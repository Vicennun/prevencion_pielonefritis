import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';
import { UROCULTIVO_ESTADOS } from '../services/clinicalEngine';

export default function ProRevisionExamen({ examenId }) {
  const [pendientes, setPendientes] = useState([]);
  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [form, setForm] = useState({
    estado: '',
    resultadoCultivo: '',
    microorganismo: '',
    recuentoColonias: '',
    resumenAntibiograma: '',
    conductaDocumentada: '',
    resistenteATratamiento: false,
  });

  const cargarFormularioDesdeExamen = (ex) => {
    if (!ex) return;
    const yaRevisado = ex.estado && ex.estado.startsWith('Revisado');
    setForm({
      estado: yaRevisado ? ex.estado : '',
      resultadoCultivo: ex.resultado_cultivo || '',
      microorganismo: ex.microorganismo || '',
      recuentoColonias: ex.recuento_colonias || '',
      resumenAntibiograma: ex.resumen_antibiograma || '',
      conductaDocumentada: ex.conducta_documentada || '',
      resistenteATratamiento: Boolean(ex.resistente_a_tratamiento),
    });
  };

  const cargar = async (targetId = examenId) => {
    setLoading(true);
    try {
      const lista = await api.getExamenesPendientes();
      setPendientes(lista || []);

      let seleccionado = null;
      if (targetId) {
        seleccionado = await api.getExamenById(targetId);
      } else if (lista?.length) {
        seleccionado = lista[0];
      }

      setExamen(seleccionado);
      cargarFormularioDesdeExamen(seleccionado);
    } catch (err) {
      console.error('Error cargando examen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar(examenId);
  }, [examenId]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!examen) return;
    if (!form.estado) {
      setFeedback('Selecciona conscientemente el nuevo estado oficial del examen antes de guardar.');
      return;
    }

    setSaving(true);
    setFeedback('');

    try {
      const proName = getStoredUser()?.nombreCompleto || 'Equipo médico';
      const actualizado = await api.revisarExamen(examen.id, {
        ...form,
        profesionalRevisor: proName,
      });
      setExamen(actualizado);
      setFeedback('Revisión y conducta clínica guardadas correctamente. El paciente ya puede ver la actualización.');
      const lista = await api.getExamenesPendientes();
      setPendientes(lista || []);
    } catch (err) {
      setFeedback(`Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-600 text-sm font-medium">Cargando visor de exámenes...</p>
      </main>
    );
  }

  const isPdf = examen?.url_archivo?.toLowerCase().includes('.pdf');

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto pb-16">
      {pendientes.length > 0 && (
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-2 text-xs font-semibold text-slate-500 uppercase">Exámenes pendientes:</span>
          {pendientes.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setExamen(p);
                cargarFormularioDesdeExamen(p);
                setFeedback('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                examen?.id === p.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.paciente?.nombre_completo || 'Paciente'} · {p.nombre_archivo || p.tipo_examen}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="self-start px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded border border-amber-300 uppercase">
            {examen ? examen.estado : 'Sin pendientes'}
          </span>
          <h1 className="text-blue-800 text-3xl font-bold font-['Inter']">
            {examen ? examen.tipo_examen || 'Revisión de examen' : 'Revisión de exámenes'}
          </h1>
          {examen && (
            <p className="text-slate-600 text-sm">
              Paciente: <strong>{examen.paciente?.nombre_completo || 'Paciente'}</strong> · Subido el{' '}
              {new Date(examen.fecha_subida).toLocaleString('es-CL')}
            </p>
          )}
        </div>

        <a
          href={examen ? `#profesional/seguimiento-activo/${examen.paciente_id}` : '#profesional/seguimiento-activo'}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 text-sm font-semibold"
        >
          Volver al Monitor
        </a>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {!examen ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
          No hay exámenes pendientes de revisión en este momento.
        </div>
      ) : (
        <div className="flex-1 flex flex-col xl:flex-row gap-6 items-start">
          {/* Visor Real */}
          <div className="w-full xl:flex-1 bg-zinc-800 rounded-2xl border border-slate-300 shadow-sm flex flex-col overflow-hidden min-h-[540px]">
            <div className="px-4 py-3 bg-zinc-900 flex justify-between items-center gap-3">
              <span className="text-zinc-200 text-xs font-semibold truncate">
                {examen.nombre_archivo || 'Documento clínico'}
              </span>
              {examen.url_archivo && (
                <a
                  href={examen.url_archivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs font-semibold shrink-0"
                >
                  Abrir en nueva pestaña ↗
                </a>
              )}
            </div>

            <div className="flex-1 p-4 flex items-center justify-center bg-zinc-700 min-h-[500px]">
              {examen.url_archivo ? (
                isPdf ? (
                  <iframe
                    src={examen.url_archivo}
                    title={examen.nombre_archivo}
                    className="w-full h-[560px] bg-white rounded-lg"
                  />
                ) : (
                  <img
                    src={examen.url_archivo}
                    alt={examen.nombre_archivo}
                    className="max-w-full max-h-[560px] object-contain rounded-lg shadow-lg bg-white"
                  />
                )
              ) : (
                <div className="max-w-md bg-white rounded-xl p-6 text-center flex flex-col gap-2 shadow-lg">
                  <span className="text-slate-900 text-sm font-bold">Sin archivo adjunto en Storage</span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Este registro corresponde a un caso sintético sin PDF cargado. Sube un archivo desde la vista <strong>Mis Exámenes</strong> del paciente para verlo aquí.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Formulario sin valores predeterminados */}
          <form
            onSubmit={handleGuardar}
            className="w-full xl:w-[440px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col shrink-0"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-slate-900 text-lg font-bold">Transcripción y conducta clínica</h2>
              <p className="text-slate-600 text-xs mt-1">
                Interpreta el cultivo junto con los síntomas del paciente. La plataforma no cambia antibióticos automáticamente.
              </p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-800 text-xs font-semibold">Estado oficial del urocultivo / examen</label>
                <span className="text-slate-500 text-xs">Selecciona explícitamente el estado tras tu revisión.</span>
                <select
                  required
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                >
                  <option value="">Selecciona un estado...</option>
                  {UROCULTIVO_ESTADOS.map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-800 text-xs font-semibold">Resultado del cultivo</label>
                <span className="text-slate-500 text-xs">Conserva también resultados negativos o muestras contaminadas.</span>
                <select
                  value={form.resultadoCultivo}
                  onChange={(e) => setForm({ ...form, resultadoCultivo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                >
                  <option value="">Selecciona un resultado...</option>
                  <option value="positivo">Positivo</option>
                  <option value="negativo">Negativo</option>
                  <option value="contaminado">Muestra contaminada / no interpretable</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-800 text-xs font-semibold">Microorganismo aislado</label>
                <span className="text-slate-500 text-xs">Escribe el germen reportado por el laboratorio (ej. Escherichia coli, Klebsiella).</span>
                <input
                  type="text"
                  value={form.microorganismo}
                  onChange={(e) => setForm({ ...form, microorganismo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-800 text-xs font-semibold">Recuento de colonias y unidades</label>
                <span className="text-slate-500 text-xs">Especifica valor y unidades exactas (ej. &gt; 100.000 UFC/mL).</span>
                <input
                  type="text"
                  value={form.recuentoColonias}
                  onChange={(e) => setForm({ ...form, recuentoColonias: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-800 text-xs font-semibold">Antibiograma e interpretación</label>
                <span className="text-slate-500 text-xs">Detalla sensibilidad, resistencia o presencia de BLEE según informe.</span>
                <textarea
                  rows={3}
                  value={form.resumenAntibiograma}
                  onChange={(e) => setForm({ ...form, resumenAntibiograma: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 resize-y"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-800 text-xs font-semibold">Conducta clínica documentada</label>
                <span className="text-slate-500 text-xs">Registra la decisión tomada o el canal donde se comunicó el ajuste al paciente.</span>
                <textarea
                  rows={2}
                  value={form.conductaDocumentada}
                  onChange={(e) => setForm({ ...form, conductaDocumentada: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 resize-y"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.resistenteATratamiento}
                  onChange={(e) => setForm({ ...form, resistenteATratamiento: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-red-700"
                />
                <span className="text-amber-900 text-xs leading-snug">
                  Marcar alerta de resistencia al tratamiento empírico actual (requiere reevaluación profesional).
                </span>
              </label>
            </div>

            <div className="p-5 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-colors text-white rounded-xl text-sm font-bold shadow-sm cursor-pointer"
              >
                {saving ? 'Guardando revisión...' : 'Guardar revisión y documentar conducta'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}