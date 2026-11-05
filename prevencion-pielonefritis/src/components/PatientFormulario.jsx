import React, { useState } from 'react';

export default function PatientFormulario() {
  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    tiempoSintoma: '',
    dolorActual: '',
    medicamentos: '',
    alergias: '',
    sintomasRespiratorios: '',
    observaciones: ''
  });

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calcula el porcentaje de completitud (basado en 7 campos)
  const filledFields = Object.values(formData).filter(val => val.trim() !== '').length;
  const progressPercentage = Math.round((filledFields / 7) * 100);

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">
            Formulario médico de preguntas generales
          </h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Completa esta información para ayudarnos a entender tu estado de salud antes de la consulta.
          </p>
        </div>
        <div className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm shrink-0">
          <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
          <span className="text-slate-900 text-xs font-medium font-['Inter']">3 notificaciones</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Columna Principal (El Formulario) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1.5">
            <h2 className="text-slate-900 text-lg font-bold font-['Inter']">Formulario médico de preguntas generales</h2>
            <p className="text-slate-500 text-xs font-normal font-['Inter']">
              Completa la siguiente información para ayudar al equipo médico a entender tu estado de salud antes de la consulta.
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="flex flex-col gap-1">
            <div className="w-full h-2 bg-slate-200 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-teal-700 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-slate-500 text-xs font-medium font-['Inter']">{progressPercentage}% completado</span>
          </div>

          <form className="flex flex-col gap-8">
            
            {/* Sección 1: Antecedentes generales */}
            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 text-sm font-bold font-['Inter']">1. Antecedentes generales</h3>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="motivoConsulta" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Cuál es tu motivo principal de consulta hoy?
                </label>
                <input 
                  type="text"
                  id="motivoConsulta"
                  name="motivoConsulta"
                  value={formData.motivoConsulta}
                  onChange={handleChange}
                  placeholder="Ej. dolor de cabeza, control de presión, seguimiento de tratamiento"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="tiempoSintoma" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Cuánto tiempo llevas con este síntoma?
                </label>
                <input 
                  type="text"
                  id="tiempoSintoma"
                  name="tiempoSintoma"
                  value={formData.tiempoSintoma}
                  onChange={handleChange}
                  placeholder="Ej. 2 días, 1 semana, 3 meses"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="dolorActual" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Te duele o te molesta algo en este momento?
                </label>
                <input 
                  type="text"
                  id="dolorActual"
                  name="dolorActual"
                  value={formData.dolorActual}
                  onChange={handleChange}
                  placeholder="Describe brevemente si hay dolor, molestia o malestar"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
                />
              </div>
            </div>

            {/* Sección 2: Salud actual */}
            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 text-sm font-bold font-['Inter']">2. Salud actual</h3>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="medicamentos" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Estás tomando algún medicamento actualmente?
                </label>
                <input 
                  type="text"
                  id="medicamentos"
                  name="medicamentos"
                  value={formData.medicamentos}
                  onChange={handleChange}
                  placeholder="Ej. nombre del medicamento, dosis y frecuencia"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="alergias" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Tienes alergias conocidas a algún medicamento o sustancia?
                </label>
                <input 
                  type="text"
                  id="alergias"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  placeholder="Ej. penicilina, anestesia, látex, alimentos"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sintomasRespiratorios" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Has tenido fiebre, tos o dificultad para respirar en los últimos 7 días?
                </label>
                <input 
                  type="text"
                  id="sintomasRespiratorios"
                  name="sintomasRespiratorios"
                  value={formData.sintomasRespiratorios}
                  onChange={handleChange}
                  placeholder="Sí / No. Si sí, describe brevemente"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
                />
              </div>
            </div>

            {/* Sección 3: Observaciones adicionales */}
            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 text-sm font-bold font-['Inter']">3. Observaciones adicionales</h3>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="observaciones" className="text-slate-900 text-sm font-semibold font-['Inter']">
                  ¿Hay algo más que quieras compartir con tu médico antes de la consulta?
                </label>
                <textarea 
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Describe cualquier antecedente, cambio en tu rutina o inquietud que consideres relevante"
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors resize-y"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="button"
                className="flex-1 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center"
              >
                Guardar borrador
              </button>
              <button 
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Formulario enviado", formData);
                  // Aquí conectaremos a Supabase
                }}
                className="flex-1 px-4 py-3 bg-teal-700 text-white hover:bg-teal-800 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center"
              >
                Enviar formulario
              </button>
            </div>
          </form>
        </div>

        {/* Columna Secundaria (Widgets del Paciente) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Tarjeta de Datos del Paciente */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Datos del paciente</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Paciente</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">Camila Soto</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Rut</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">xx.xxx.xxx-x</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Edad</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">24</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-xs font-semibold font-['Inter']">Contacto</span>
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">+569 xxxx xxxx</span>
              </div>
            </div>

            <button className="w-full mt-2 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center">
              Ver historial
            </button>
          </section>

          {/* Tarjeta Próxima Consulta */}
          <section className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3">
            <h3 className="text-slate-900 text-base font-bold font-['Inter']">Próxima consulta</h3>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">Consulta aún no requerida</span>
              <span className="text-slate-500 text-xs font-normal font-['Inter']">Un profesional te será asignado si lo necesitas</span>
            </div>
            <button className="w-full mt-1 px-4 py-3 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors rounded-[10px] text-sm font-semibold font-['Inter'] flex justify-center items-center">
              Ver más información
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}