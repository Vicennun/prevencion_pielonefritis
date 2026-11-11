import React from 'react';

export default function ProRevisionExamen() {
  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded border border-red-200 uppercase">
              Documento Pendiente de Revisión
            </span>
          </div>
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Urocultivo de control</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Subido por Mateo Fuentes (PAC-001284) hace 10 minutos.
          </p>
        </div>
        <a href="#profesional/seguimiento-activo" className="px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 text-sm font-semibold transition-colors">
          Cerrar revisión
        </a>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-6 overflow-hidden">
        
        {/* Visualizador del Documento (Izquierda) */}
        <div className="flex-1 bg-zinc-700 rounded-2xl border border-slate-300 shadow-sm flex flex-col overflow-hidden h-[500px] xl:h-auto">
          <div className="px-4 py-2 bg-zinc-800 flex justify-between items-center shrink-0">
            <span className="text-zinc-300 text-xs font-semibold">Urocultivo_Mateo_Octubre.pdf (1/1)</span>
            <div className="flex gap-2">
              <button className="w-6 h-6 bg-zinc-600 hover:bg-zinc-500 rounded flex justify-center items-center text-white text-xs">+</button>
              <button className="w-6 h-6 bg-zinc-600 hover:bg-zinc-500 rounded flex justify-center items-center text-white text-xs">-</button>
            </div>
          </div>
          {/* Documento simulado */}
          <div className="flex-1 p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-lg bg-white shadow-xl h-[800px] p-8 flex flex-col gap-4 cursor-text">
              <h2 className="text-center font-bold text-xl border-b pb-2">LABORATORIO CLÍNICO CENTRAL</h2>
              <div className="text-sm space-y-1">
                <p><strong>Paciente:</strong> Mateo Fuentes Rojas</p>
                <p><strong>Muestra:</strong> Orina (Chorro medio)</p>
              </div>
              <div className="mt-4 text-sm border border-slate-800 p-4">
                <h3 className="font-bold underline mb-2">EXAMEN BACTERIOLÓGICO (UROCULTIVO)</h3>
                <p className="text-red-600 font-bold mt-2">RESULTADO: POSITIVO</p>
                <p className="mt-1"><strong>Desarrollo de:</strong> Escherichia coli</p>
                <p className="mt-1"><strong>Recuento de colonias:</strong> &gt; 100.000 UFC/mL</p>
              </div>
              <div className="mt-4 text-sm border border-slate-800 p-4">
                <h3 className="font-bold underline mb-2">ANTIBIOGRAMA</h3>
                <p className="text-green-700">Sensible: Ciprofloxacino, Nitrofurantoína.</p>
                <p className="text-red-700">Resistente: Amoxicilina, Cefadroxilo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Transcripción Clínica (Derecha) */}
        <div className="w-full xl:w-[450px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col shrink-0 h-max overflow-y-auto">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Digitalizar Resultado</h2>
            <p className="text-slate-500 text-xs font-normal mt-1">Extrae los datos clave para actualizar el Semáforo Clínico del paciente.</p>
          </div>
          
          <div className="p-5 flex flex-col gap-5">
            {/* Campo: Resultado General */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Resultado del Cultivo</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-700">
                <option value="">Selecciona un estado...</option>
                <option value="positivo">Positivo (Infección)</option>
                <option value="negativo">Negativo</option>
                <option value="contaminado">Muestra contaminada (Rechazado)</option>
              </select>
            </div>

            {/* Campo: Microorganismo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Microorganismo Aislado</label>
              <input type="text" defaultValue="Escherichia coli" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-700" />
            </div>

            {/* Campo: Recuento */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Recuento de Colonias (UFC/mL)</label>
              <input type="text" defaultValue="> 100.000" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-700" />
            </div>

            {/* Campo: Antibiograma */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-semibold">Resumen Antibiograma</label>
              <textarea rows="3" defaultValue="Sensible: Ciprofloxacino, Nitrofurantoína. Resistente: Amoxicilina." className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-700 resize-none"></textarea>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 mt-2">
              <span className="text-xl">⚠️</span>
              <p className="text-amber-800 text-xs font-medium leading-relaxed">
                Al guardar, este examen pasará a estado "Revisado". Si el microorganismo es resistente al tratamiento actual del paciente, el semáforo se actualizará a Riesgo Alto automáticamente.
              </p>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 flex flex-col gap-3">
            <button className="w-full py-3 bg-red-700 hover:bg-red-800 transition-colors text-white rounded-xl text-sm font-bold shadow-sm">
              Guardar e Informar al Paciente
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}