import React, { useEffect, useState } from 'react';

const SCALES = [
  { id: 'normal', label: 'A', pct: '100%', title: 'Tamaño normal' },
  { id: 'large', label: 'A+', pct: '112.5%', title: 'Letra grande' },
  { id: 'xlarge', label: 'A++', pct: '125%', title: 'Letra muy grande' },
];

export default function AccessibilityBar() {
  const [scaleId, setScaleId] = useState(() => localStorage.getItem('ceroNefritisFontScale') || 'normal');

  useEffect(() => {
    const found = SCALES.find((s) => s.id === scaleId) || SCALES[0];
    document.documentElement.style.fontSize = found.pct;
    localStorage.setItem('ceroNefritisFontScale', scaleId);
  }, [scaleId]);

  return (
    <div
      aria-label="Controles de accesibilidad de tamaño de texto"
      className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur border border-slate-300 shadow-lg rounded-full px-3 py-1.5 flex items-center gap-1.5"
    >
      <span className="text-[11px] font-semibold text-slate-600 pr-1 hidden sm:inline">Texto:</span>
      {SCALES.map((s) => (
        <button
          key={s.id}
          type="button"
          title={s.title}
          onClick={() => setScaleId(s.id)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
            scaleId === s.id
              ? 'bg-teal-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}