import React, { useState } from 'react';
import { evaluarSemaforoClinico, PRIORIDAD_META } from '../services/clinicalEngine';

export default function PublicAutochequeo() {
  const [form, setForm] = useState({
    enSeguimientoItu: false,
    ituConfirmadas6m: '',
    ituConfirmadas12m: '',
    temperatura: '',
    dolorLumbar: '',
    sintomasUrinarios: false,
    dolorFlanco: false,
    escalofriosTemblor: false,
    vomitosPersistentes: false,
    disminucionOrina: false,
    sangreOrina: false,
    coagulosRetencion: false,
    confusionODeterioro: false,
    desmayoODisnea: false,
    embarazo: false,
  });
  const [resultado, setResultado] = useState(null);

  const handleEvaluar = (e) => {
    e.preventDefault();
    const res = evaluarSemaforoClinico({
      ...form,
      requiereContextoItu: true,
      toleraLiquidosMedicamentos: !form.vomitosPersistentes,
    });
    setResultado(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const meta = resultado
    ? PRIORIDAD_META[resultado.nivelSemaforo] || PRIORIDAD_META.INFORMACION_INSUFICIENTE
    : null;

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-6 lg:p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-16">
        <div className="flex flex-col gap-1.5">
          <span className="self-start px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold uppercase">
            Autochequeo orientativo gratuito · Sin cuenta
          </span>
          <h2 className="text-slate-900 text-2xl lg:text-3xl font-bold font-['Inter']">
            Revisa tus síntomas y riesgo urinario
          </h2>
          <p className="text-slate-700 text-sm">
            Responde tu contexto urinario y mediciones actuales para recibir una orientación acorde a tus síntomas. Para guardar historial semanal y activar derivación automática al equipo médico, crea tu cuenta gratuita.
          </p>
        </div>

        {/* Resultado inmediato */}
        {resultado && meta && (
          <div className={`p-6 bg-white rounded-2xl border-2 ${meta.border} shadow-sm flex flex-col gap-3`}>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${meta.badge}`}>
                {meta.label}
              </span>
              <span className="text-slate-800 text-sm font-bold">{resultado.tituloSemaforo}</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-medium">{resultado.mensajeProtocolo}</p>
            <div className="flex flex-wrap gap-2">
              {resultado.triggersActivos.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                  {t}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3">
              <a
                href="#inicio"
                className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
              >
                Crear cuenta gratis y activar seguimiento / derivación
              </a>
              <a
                href="#prevencion-gratis"
                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Ver guía de prevención
              </a>
            </div>
          </div>
        )}

        <form onSubmit={handleEvaluar} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
          {/* Bloque 1: Contexto urinario y recurrencia */}
          <div className="flex flex-col gap-3">
            <h3 className="text-slate-900 text-sm font-bold">1. Contexto de infección urinaria (ITU)</h3>
            <label className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enSeguimientoItu}
                onChange={(e) => setForm({ ...form, enSeguimientoItu: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-teal-700"
              />
              <span className="text-slate-800 text-xs font-medium leading-snug">
                Actualmente tengo una infección urinaria confirmada o estoy en tratamiento / seguimiento por una.
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">ITU confirmadas en los últimos 6 meses</label>
                <span className="text-slate-500 text-xs">Escribe el número de episodios confirmados (0 si no has tenido).</span>
                <input
                  type="number"
                  min="0"
                  value={form.ituConfirmadas6m}
                  onChange={(e) => setForm({ ...form, ituConfirmadas6m: e.target.value })}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">ITU confirmadas en los últimos 12 meses</label>
                <span className="text-slate-500 text-xs">Total de episodios confirmados durante el último año.</span>
                <input
                  type="number"
                  min="0"
                  value={form.ituConfirmadas12m}
                  onChange={(e) => setForm({ ...form, ituConfirmadas12m: e.target.value })}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bloque 2: Mediciones actuales */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
            <h3 className="text-slate-900 text-sm font-bold">2. Mediciones actuales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Temperatura actual (°C)</label>
                <span className="text-slate-500 text-xs">Valor medido con termómetro (déjalo vacío si no mediste).</span>
                <input
                  type="number"
                  step="0.1"
                  min="34"
                  max="43"
                  value={form.temperatura}
                  onChange={(e) => setForm({ ...form, temperatura: e.target.value })}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-900 text-xs font-semibold">Intensidad del dolor (0 a 10)</label>
                <span className="text-slate-500 text-xs">0 = sin dolor · 10 = dolor máximo imaginable.</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.dolorLumbar}
                  onChange={(e) => setForm({ ...form, dolorLumbar: e.target.value })}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Síntomas hoy */}
          <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-5">
            <h3 className="text-slate-900 text-sm font-bold">3. Marca solo lo que presentas hoy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                ['sintomasUrinarios', 'Ardor al orinar, urgencia o aumento de frecuencia'],
                ['dolorFlanco', 'Dolor nuevo o creciente en costado o espalda baja'],
                ['escalofriosTemblor', 'Escalofríos intensos con temblor'],
                ['vomitosPersistentes', 'Vómitos persistentes o incapacidad para beber líquidos'],
                ['disminucionOrina', 'Disminución importante de la cantidad de orina'],
                ['sangreOrina', 'Sangre visible en la orina'],
                ['coagulosRetencion', 'Coágulos en orina con dificultad para orinar'],
                ['confusionODeterioro', 'Confusión o somnolencia de nueva aparición'],
                ['desmayoODisnea', 'Desmayo, dificultad respiratoria o deterioro rápido'],
                ['embarazo', 'Embarazo o posibilidad de embarazo'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-start gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-teal-700"
                  />
                  <span className="text-slate-800 text-xs font-medium leading-snug">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold cursor-pointer"
          >
            Ver orientación clínica
          </button>
        </form>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-teal-900 text-xs font-medium">
            ¿Quieres llevar seguimiento semanal automático y derivación a un profesional si aparece una alerta?
          </span>
          <a
            href="#inicio"
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0"
          >
            Mantener seguimiento gratis
          </a>
        </div>
      </div>
    </main>
  );
}