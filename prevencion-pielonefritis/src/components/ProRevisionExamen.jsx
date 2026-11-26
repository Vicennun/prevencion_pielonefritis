import React, { useEffect, useState } from 'react';
import { api, getStoredUser } from '../services/api';
import { PRIORIDAD_META, formatearHidratacion } from '../services/clinicalEngine';

export default function ProSeguimientoActivo({ pacienteInicialId }) {
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedPacId, setSelectedPacId] = useState(pacienteInicialId || null);
  const [checkins, setCheckins] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Modal de hidratación y techos nutricionales individualizados
  const [showLimitesModal, setShowLimitesModal] = useState(false);
  const [savingLimites, setSavingLimites] = useState(false);
  const [limitesForm, setLimitesForm] = useState({
    restriccion: false,
    metaMl: '',
    notaHidrica: '',
    sodio: '',
    proteinas: '',
    carbohidratos: '',
    indicacion: '',
  });

  const cargarSeguimientos = async () => {
    try {
      const lista = await api.getSeguimientos();
      setSeguimientos(lista || []);
      if (lista?.length) {
        const existeInicial = pacienteInicialId && lista.some((s) => s.paciente_id === pacienteInicialId);
        if (existeInicial) {
          setSelectedPacId(pacienteInicialId);
        } else if (!selectedPacId || !lista.some((s) => s.paciente_id === selectedPacId)) {
          setSelectedPacId(lista[0].paciente_id);
        }
      }
    } catch (err) {
      console.error('Error cargando seguimientos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSeguimientos();
  }, [pacienteInicialId]);

  const currentSeg = seguimientos.find((s) => s.paciente_id === selectedPacId) || seguimientos[0] || null;

  useEffect(() => {
    if (!currentSeg) return;
    setActionMsg('');
    const cargarDetalles = async () => {
      try {
        const [chk, exs] = await Promise.all([
          api.getCheckins(currentSeg.id),
          api.getExamenesPaciente(currentSeg.paciente_id),
        ]);
        setCheckins(chk || []);
        setExamenes(exs || []);
      } catch (err) {
        console.error(err);
      }
    };
    cargarDetalles();
  }, [currentSeg?.id]);

  const abrirModalLimites = () => {
    if (!currentSeg?.paciente) return;
    const lim = currentSeg.paciente.limites_nutricionales || {};
    setLimitesForm({
      restriccion: Boolean(currentSeg.paciente.restriccionHidrica),
      metaMl: currentSeg.paciente.metaHidricaMl ? String(currentSeg.paciente.metaHidricaMl) : '',
      notaHidrica: currentSeg.paciente.metaHidricaNota || '',
      sodio: lim.sodio || '',
      proteinas: lim.proteinas || '',
      carbohidratos: lim.carbohidratos || '',
      indicacion: lim.indicacion || '',
    });
    setShowLimitesModal(true);
  };

  const handleGuardarLimites = async (e) => {
    e.preventDefault();
    if (!currentSeg?.paciente) return;
    setSavingLimites(true);
    try {
      await api.actualizarUsuario(currentSeg.paciente_id, {
        restriccion_hidrica: Boolean(limitesForm.restriccion),
        meta_hidrica_ml: limitesForm.metaMl ? Number(limitesForm.metaMl) : null,
        meta_hidrica_nota:
          limitesForm.notaHidrica.trim() || 'Meta o límite individual definido por el equipo tratante.',
        limites_nutricionales: {
          sodio: limitesForm.sodio.trim() || null,
          proteinas: limitesForm.proteinas.trim() || null,
          carbohidratos: limitesForm.carbohidratos.trim() || null,
          indicacion: limitesForm.indicacion.trim() || null,
          actualizado_en: new Date().toISOString(),
        },
      });
      setShowLimitesModal(false);
      setActionMsg('Metas hídricas y techos nutricionales actualizados en la ficha del paciente.');
      await cargarSeguimientos();
    } catch (err) {
      alert(`Error al actualizar indicaciones: ${err.message}`);
    } finally {
      setSavingLimites(false);
    }
  };

  const handleAccionRapida = async (titulo, descripcion) => {
    if (!currentSeg) return;
    try {
      const proId = getStoredUser()?.id || 1;
      await api.crearRecordatorio({
        paciente_id: currentSeg.paciente_id,
        profesional_id: proId,
        tipo: 'enviado',
        titulo,
        descripcion,
        frecuencia: 'Puntual',
        prioridad: 'Alta',
        fecha_programada: 'Hoy',
        activo: true,
      });
      setActionMsg(`Acción registrada y notificada al paciente: "${titulo}".`);
    } catch (err) {
      alert(`No se pudo registrar la acción: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-600 text-sm font-medium">Cargando Monitor Clínico...</p>
      </main>
    );
  }

  if (!currentSeg) {
    return (
      <main className="flex-1 bg-neutral-200 min-h-screen p-8 flex items-center justify-center">
        <p className="text-slate-600 text-sm">No hay pacientes en seguimiento activo.</p>
      </main>
    );
  }

  const meta = PRIORIDAD_META[currentSeg.nivel_semaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
  const paciente = currentSeg.paciente || {};
  const limNut = paciente.limites_nutricionales || {};
  const examenPendiente = examenes.find((ex) => ex.estado.startsWith('Resultado disponible')) || examenes[0] || null;

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto pb-16">
      {/* Selector de Pacientes ordenados por prioridad */}
      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
        <span className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Prioridad clínica:
        </span>
        {seguimientos.map((s) => {
          const sMeta = PRIORIDAD_META[s.nivel_semaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE;
          const isSelected = s.paciente_id === currentSeg.paciente_id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedPacId(s.paciente_id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{s.paciente?.nombreCompleto}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  isSelected ? 'bg-white/20 text-white' : sMeta.badge
                }`}
              >
                {sMeta.short}
              </span>
            </button>
          );
        })}
      </div>

      {/* Header (Azul clínico) */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-semibold uppercase">Monitor de Evaluación Clínica</span>
            <span className="px-2 py-0.5 bg-blue-800 text-white text-[10px] font-bold rounded uppercase">
              Reglas deterministas
            </span>
          </div>
          <h1 className="text-blue-800 text-3xl font-bold font-['Inter']">{currentSeg.diagnostico}</h1>
          <p className="text-slate-600 text-sm">
            {paciente.nombreCompleto} · PAC-{String(currentSeg.paciente_id).padStart(4, '0')} · {paciente.edad ? `${paciente.edad} años` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`#profesional/detalle-paciente/${currentSeg.paciente_id}`}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold"
          >
            Ver ficha completa
          </a>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold">
          {actionMsg}
        </div>
      )}

      {/* Widget Principal: Semáforo Determinista */}
      <div className={`p-6 bg-white rounded-2xl border-2 ${meta.border} flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm`}>
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${meta.badge}`}>
              {meta.label}
            </span>
            <h2 className="text-slate-900 text-lg font-bold">{currentSeg.titulo_semaforo}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(currentSeg.triggers_activos || []).map((t, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg">
                {t}
              </span>
            ))}
          </div>

          <p className="text-slate-700 text-sm leading-relaxed border-l-2 border-slate-300 pl-3">
            <strong>Lectura del protocolo:</strong> {currentSeg.mensaje_protocolo}
          </p>

          <div className="flex flex-wrap gap-6 pt-1 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase block">Día de seguimiento</span>
              <span className="text-slate-900 font-semibold">
                Día {currentSeg.dia_actual || 1} de {currentSeg.total_dias || 7}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase block">Tratamiento registrado</span>
              <span className="text-slate-900 font-semibold">{currentSeg.antibiotico_actual || 'Pendiente'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase block">Antecedentes</span>
              <span className="text-slate-900 font-semibold">
                {(paciente.antecedentes?.length ? paciente.antecedentes : ['Sin antecedentes']).join(' · ')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full xl:w-auto shrink-0">
          {(currentSeg.nivel_semaforo === 'URGENCIA_INMEDIATA' || currentSeg.nivel_semaforo === 'ROJO') && (
            <button
              onClick={() =>
                handleAccionRapida(
                  'Citación a valoración presencial urgente',
                  'Se solicitó asistencia a valoración presencial por criterios activos en el monitor clínico.'
                )
              }
              className="px-5 py-3.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-sm cursor-pointer"
            >
              Notificar valoración presencial hoy
            </button>
          )}
          {currentSeg.nivel_semaforo === 'AMARILLO' && (
            <button
              onClick={() =>
                handleAccionRapida(
                  'Contacto clínico de seguimiento',
                  'Tu equipo revisó tu evolución; por favor mantén registro diario y coordina evaluación si no mejoras en 48–72 horas.'
                )
              }
              className="px-5 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-sm cursor-pointer"
            >
              Enviar aviso de control
            </button>
          )}
          <a
            href={`#profesional/mensajes/${currentSeg.paciente_id}`}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold text-center"
          >
            Abrir chat con paciente
          </a>
        </div>
      </div>

      {/* Alertas Paralelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentSeg.alerta_metabolica && currentSeg.alerta_metabolica !== 'NINGUNA' && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col gap-1">
            <span className="text-amber-900 text-xs font-bold uppercase">
              Alerta metabólica paralela ({currentSeg.alerta_metabolica.replace(/_/g, ' ')})
            </span>
            <p className="text-amber-800 text-xs leading-relaxed">{currentSeg.mensaje_metabolico}</p>
          </div>
        )}

        {currentSeg.alerta_reevaluacion_imagen && (
          <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl flex flex-col gap-1">
            <span className="text-blue-900 text-xs font-bold uppercase">
              Sugerencia clínica: valorar estudio de imagen
            </span>
            <p className="text-blue-800 text-xs leading-relaxed">{currentSeg.mensaje_reevaluacion_imagen}</p>
          </div>
        )}
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Temperatura actual</span>
          <span className="text-slate-900 text-2xl font-bold">
            {currentSeg.temperatura_actual != null ? `${currentSeg.temperatura_actual} °C` : 'Sin registro'}
          </span>
          <span className="text-slate-500 text-[11px]">≥ 38.0 °C = Rojo · 37.5–37.9 °C = Amarillo</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Dolor (0–10)</span>
          <span className="text-slate-900 text-2xl font-bold">
            {currentSeg.dolor_lumbar_actual != null ? `${currentSeg.dolor_lumbar_actual} / 10` : 'Sin registro'}
          </span>
          <span className="text-slate-500 text-[11px]">
            {[currentSeg.dolor_localizacion, currentSeg.dolor_evolucion].filter(Boolean).join(' · ') || 'Sin detalle de evolución'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Hidratación registrada</span>
          <span className="text-slate-900 text-sm font-bold">{formatearHidratacion(currentSeg.ml_hidratacion)}</span>
          <span className={`text-[11px] font-semibold ${paciente.restriccionHidrica ? 'text-red-700' : 'text-slate-500'}`}>
            {paciente.restriccionHidrica
              ? `RESTRICCIÓN: máx. ${paciente.metaHidricaMl || 1200} mL/día`
              : `Meta individual: ${paciente.metaHidricaMl || 1750} mL/día`}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Glucosa / Adherencia</span>
          <span className="text-slate-900 text-2xl font-bold">
            {currentSeg.glucosa_capilar_actual != null
              ? `${currentSeg.glucosa_capilar_actual} mg/dL`
              : `${currentSeg.adherencia_porcentaje ?? 100}% adh.`}
          </span>
          <span className="text-slate-500 text-[11px]">
            {currentSeg.disminucion_orina ? 'Diuresis disminuida reportada · ' : ''}
            Dosis omitidas: {currentSeg.dosis_omitidas ?? 0}
          </span>
        </div>
      </div>

      {/* Tendencias + Gestión Manual */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
          <div>
            <h3 className="text-slate-900 text-base font-bold">Tendencias de hidratación y síntomas</h3>
            <p className="text-slate-500 text-xs">
              Historial cronológico con fecha y hora (registro descriptivo; no establece causalidad automática).
            </p>
          </div>

          {checkins.length === 0 ? (
            <p className="text-slate-500 text-xs">Aún no hay chequeos históricos registrados para este paciente.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2 pr-3">Fecha / hora</th>
                    <th className="py-2 pr-3">Temp.</th>
                    <th className="py-2 pr-3">Dolor</th>
                    <th className="py-2 pr-3">Líquidos</th>
                    <th className="py-2 pr-3">Glucosa</th>
                    <th className="py-2">Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-2.5 pr-3 text-slate-600">
                        {new Date(c.created_at).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 pr-3 font-semibold text-slate-900">
                        {c.temperatura != null ? `${c.temperatura} °C` : '—'}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">{c.dolor_lumbar != null ? `${c.dolor_lumbar}/10` : '—'}</td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {c.ml_hidratacion != null ? formatearHidratacion(c.ml_hidratacion) : '—'}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {c.glucosa_capilar != null ? `${c.glucosa_capilar} mg/dL` : '—'}
                      </td>
                      <td className="py-2.5 text-slate-600">{c.comentario_clinico || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Gestión Manual (Azul clínico) */}
        <div className="xl:col-span-1 p-6 bg-zinc-100 rounded-2xl border border-zinc-300 flex flex-col gap-4 shadow-sm">
          <h3 className="text-blue-800 text-base font-bold">Gestión Manual</h3>
          <p className="text-slate-600 text-xs">
            Documenta decisiones clínicas, revisa cultivos e individualiza límites hídricos o nutricionales.
          </p>

          {(limNut.sodio || limNut.proteinas || limNut.carbohidratos) && (
            <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-700 flex flex-col gap-1">
              <span className="text-blue-800 font-bold text-[11px] uppercase">Techos nutricionales activos</span>
              {limNut.sodio && <span>Sodio: <strong>{limNut.sodio}</strong></span>}
              {limNut.proteinas && <span>Proteínas: <strong>{limNut.proteinas}</strong></span>}
              {limNut.carbohidratos && <span>Carbohidratos: <strong>{limNut.carbohidratos}</strong></span>}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href={examenPendiente ? `#profesional/revision-examen/${examenPendiente.id}` : '#profesional/revision-examen'}
              className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl flex justify-between items-center shadow-sm"
            >
              <span>{examenPendiente ? 'Revisar examen del paciente' : 'Ir a revisión de exámenes'}</span>
              <span>›</span>
            </a>

            <button
              onClick={abrirModalLimites}
              className="w-full px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl flex justify-between items-center cursor-pointer"
            >
              <span>Metas hídricas y techos nutricionales</span>
              <span className="text-slate-400">›</span>
            </button>

            <button
              onClick={() =>
                handleAccionRapida(
                  'Evaluar estudio de imagen',
                  'Se documentó necesidad de valorar ecografía o tomografía según evolución clínica y factores de riesgo.'
                )
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl flex justify-between items-center cursor-pointer"
            >
              <span>Documentar valoración de imagen</span>
              <span className="text-slate-400">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Líquidos y Techos Nutricionales Individualizados */}
      {showLimitesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleGuardarLimites} className="w-full max-w-lg bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl my-auto">
            <h2 className="text-slate-900 text-lg font-bold">Metas hídricas y techos nutricionales</h2>
            <p className="text-slate-600 text-xs">
              Individualiza según enfermedad renal, insuficiencia cardíaca, diabetes o estado nutricional. No se aplican restricciones universales por infección urinaria.
            </p>

            <label className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={limitesForm.restriccion}
                onChange={(e) => setLimitesForm({ ...limitesForm, restriccion: e.target.checked })}
                className="w-4 h-4 accent-red-700"
              />
              <span className="text-red-800 text-xs font-bold">
                Paciente con restricción hídrica prescrita (desactiva mensajes de aumento de líquidos)
              </span>
            </label>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">
                {limitesForm.restriccion ? 'Límite máximo diario de líquidos totales (mL/día)' : 'Meta diaria individual de líquidos (mL/día)'}
              </label>
              <span className="text-xs text-slate-500">Convención: 1 vaso de referencia = 250 mL.</span>
              <input
                type="number"
                min="300"
                max="4000"
                step="50"
                value={limitesForm.metaMl}
                onChange={(e) => setLimitesForm({ ...limitesForm, metaMl: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Indicación hídrica visible al paciente</label>
              <span className="text-xs text-slate-500">Especifica si el límite incluye todas las bebidas y sopas/otros líquidos.</span>
              <input
                type="text"
                value={limitesForm.notaHidrica}
                onChange={(e) => setLimitesForm({ ...limitesForm, notaHidrica: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Sodio (unidades y periodo)</label>
                <span className="text-[11px] text-slate-500">Ej. máx. 2.000 mg/día</span>
                <input
                  type="text"
                  value={limitesForm.sodio}
                  onChange={(e) => setLimitesForm({ ...limitesForm, sodio: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Proteínas (unidades y periodo)</label>
                <span className="text-[11px] text-slate-500">Ej. 0,8 g/kg/día</span>
                <input
                  type="text"
                  value={limitesForm.proteinas}
                  onChange={(e) => setLimitesForm({ ...limitesForm, proteinas: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">Carbohidratos (unidades)</label>
                <span className="text-[11px] text-slate-500">Ej. según pauta diabetes</span>
                <input
                  type="text"
                  value={limitesForm.carbohidratos}
                  onChange={(e) => setLimitesForm({ ...limitesForm, carbohidratos: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-800">Indicación clínica nutricional</label>
              <span className="text-xs text-slate-500">Observación revisada por el equipo tratante o nutricionista.</span>
              <textarea
                rows={2}
                value={limitesForm.indicacion}
                onChange={(e) => setLimitesForm({ ...limitesForm, indicacion: e.target.value })}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLimitesModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingLimites}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {savingLimites ? 'Guardando...' : 'Guardar indicaciones'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}