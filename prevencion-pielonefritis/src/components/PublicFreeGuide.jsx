import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const FAQ_COMPLETAS = [
  {
    q: '¿Cuál es la diferencia entre cistitis y pielonefritis?',
    a: 'La cistitis afecta la vejiga y suele provocar ardor o molestia al orinar, aumento de frecuencia y dolor pélvico. La pielonefritis es una infección del riñón que suele manifestarse con fiebre, escalofríos, dolor en el costado o espalda baja y náuseas o vómitos (puede o no haber ardor al orinar).',
  },
  {
    q: '¿Una infección renal puede desaparecer sola?',
    a: 'No es seguro esperar a que pase sola; puede empeorar rápidamente y requiere evaluación y tratamiento indicado por un profesional de la salud.',
  },
  {
    q: '¿La pielonefritis es contagiosa?',
    a: 'No se contagia como un resfriado; suele originarse en bacterias del propio tracto urinario (como Escherichia coli, la causa más frecuente, aunque no la única).',
  },
  {
    q: '¿Cuándo debería comenzar a notar mejoría?',
    a: 'Con un tratamiento eficaz suele comenzar a mejorar en 48 a 72 horas. Si empeoras o no empiezas a mejorar en 48 horas, solicita reevaluación; no esperes si aparecen señales de alarma.',
  },
  {
    q: '¿Puedo tomar antibióticos que me sobraron?',
    a: 'No. Automedicarse o reutilizar antibióticos sobrantes puede ocultar síntomas, retrasar el tratamiento adecuado y favorecer resistencia bacteriana.',
  },
  {
    q: '¿Qué significa tener infecciones recurrentes?',
    a: 'Se considera recurrencia presentar 2 o más episodios sintomáticos en 6 meses o 3 o más en 12 meses. Conviene confirmarlos clínicamente y con urocultivo cuando sea posible para distinguir recaída de reinfección.',
  },
  {
    q: '¿Necesito urocultivo y debo repetirlo si ya no tengo síntomas?',
    a: 'Ante sospecha de pielonefritis se recomienda urocultivo con antibiograma en todos los casos. Repetirlo cuando ya estás sin síntomas generalmente no es de rutina, salvo indicación específica (por ejemplo, embarazo o complicación).',
  },
  {
    q: '¿Qué hago si vomito el antibiótico o no tolero líquidos?',
    a: 'Contacta a tu equipo de salud. Si los vómitos son persistentes y no toleras líquidos ni medicamentos, acude a valoración urgente.',
  },
];

export default function PublicFreeGuide() {
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPrevencionesActivas()
      .then((data) => setGuias(data || []))
      .catch((err) => console.error('Error cargando guías públicas:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-6 lg:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-16">
        {/* Cabecera + CTA recurrente */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold uppercase">
              Acceso libre · Sin registro
            </span>
            <a
              href="#inicio"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
            >
              Mantener seguimiento semanal gratuito
            </a>
          </div>

          <h2 className="text-slate-900 text-2xl lg:text-3xl font-bold font-['Inter']">
            Prevención y señales de alarma en pielonefritis
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            La pielonefritis es una infección del riñón, generalmente por bacterias que ascienden desde la vejiga; <em>Escherichia coli</em> es la causa más frecuente, aunque no la única. Esta guía es gratuita y está validada con criterios clínicos.
          </p>
        </div>

        {/* Señales de Alarma */}
        <section className="p-6 bg-red-50 rounded-2xl border border-red-200 flex flex-col gap-4">
          <h3 className="text-red-900 text-lg font-bold">¿Cuándo buscar atención médica?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 bg-white rounded-xl border-2 border-red-600 flex flex-col gap-1.5">
              <span className="text-red-700 text-xs font-bold uppercase">Urgencias inmediatas</span>
              <p className="text-slate-700 text-sm leading-relaxed">
                Confusión o somnolencia de nueva aparición, desmayo, dificultad respiratoria, coágulos con dificultad para orinar o deterioro rápido. Acude a urgencias o llama a emergencias sin esperar a que aparezcan todos los signos.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-amber-400 flex flex-col gap-1.5">
              <span className="text-amber-800 text-xs font-bold uppercase">Valoración presencial el mismo día</span>
              <p className="text-slate-700 text-sm leading-relaxed">
                Fiebre ≥ 38 °C, escalofríos intensos con temblor, dolor nuevo o creciente en costado o espalda baja, vómitos persistentes o incapacidad para beber líquidos, embarazo con síntomas o sin mejoría en 48–72 horas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#autochequeo"
              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold"
            >
              Evaluar mis síntomas ahora (gratis)
            </a>
            <a
              href="#inicio"
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold"
            >
              Crear cuenta para seguimiento y derivación
            </a>
          </div>
        </section>

        {/* Pautas en vivo desde Supabase */}
        <section className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="text-slate-900 text-lg font-bold">Pautas preventivas y de autocuidado validadas</h3>
          {loading ? (
            <p className="text-slate-500 text-sm">Cargando guías preventivas...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guias.map((g) => (
                <article key={g.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                  <span className="text-teal-700 text-[11px] font-bold uppercase">{g.categoria}</span>
                  <h4 className="text-slate-900 text-sm font-bold">{g.titulo}</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{g.descripcion}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Centro de Ayuda / 8 Preguntas Frecuentes Validadas */}
        <section className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="text-slate-900 text-lg font-bold">Preguntas frecuentes</h3>
          <div className="flex flex-col gap-3">
            {FAQ_COMPLETAS.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <h4 className="text-slate-900 text-sm font-bold">{item.q}</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Banner recurrente de seguimiento gratuito */}
        <section className="p-6 bg-teal-700 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold">¿Tuviste infecciones urinarias antes o estás en tratamiento?</h3>
            <p className="text-teal-100 text-sm">
              Activa tu seguimiento automático gratuito: registra tu evolución semanal o diaria, sube tus urocultivos y activa derivación prioritaria a un profesional si aparece una alerta.
            </p>
          </div>
          <a
            href="#inicio"
            className="px-5 py-3 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-sm font-bold shrink-0"
          >
            Activar seguimiento gratis
          </a>
        </section>

        <p className="text-slate-500 text-xs text-center leading-relaxed">
          Esta herramienta apoya el seguimiento y la prevención de pielonefritis. No realiza diagnósticos ni prescribe tratamientos y no reemplaza la evaluación presencial de un profesional de la salud.
        </p>
      </div>
    </main>
  );
}