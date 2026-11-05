import React from 'react';

export default function ProDetallePaciente() {
  
  // Datos mockeados del paciente
  const patientData = {
    name: 'Mateo Ignacio Fuentes Rojas',
    rut: '12.345.678-9',
    birthdate: '14/03/1959',
    phone: '+56 9 1234 5678',
    email: 'mateo.fuentes@correo.cl',
    commune: 'Viña del Mar',
    prevision: 'Fonasa',
    emergency: 'Carmen Rojas · +56 9 8765 4321',
    age: '67 años',
    sex: 'Masculino',
    weight: '82 kg',
    height: '1,72 m',
    imc: '27,7',
    bloodType: 'O+',
    chronic: 'Diabetes tipo 2',
    allergies: 'Penicilina',
    riskFactors: ['Diabetes descontrolada', 'Infecciones urinarias previas', 'Cálculos renales']
  };

  // KPIs del historial
  const kpis = [
    { label: 'Atenciones totales', value: '14', color: 'text-slate-900' },
    { label: 'Infecciones urinarias · 6 meses', value: '2', color: 'text-red-700' },
    { label: 'Infecciones urinarias · 12 meses', value: '3', color: 'text-red-700' },
    { label: 'Atenciones en proceso', value: '1', color: 'text-blue-700' },
  ];

  // Datos mockeados de citas anteriores
  const atenciones = [
    { id: '0000360', type: 'consulta', motive: 'Dolor lumbar, fiebre y ardor al orinar', date: '05/10/26 (11:30)', severity: 'Extremo', sevColor: 'red', status: 'En proceso', statColor: 'blue' },
    { id: '0000341', type: 'control', motive: 'Control posterior a tratamiento', date: '12/09/26 (10:00)', severity: 'Alto', sevColor: 'amber', status: 'Completado', statColor: 'green' },
    { id: '0000317', type: 'procedimiento', motive: 'Toma de urocultivo', date: '21/08/26 (16:30)', severity: 'Alto', sevColor: 'amber', status: 'Completado', statColor: 'green' },
    { id: '0000298', type: 'consulta', motive: 'Infección urinaria confirmada', date: '04/07/26 (09:30)', severity: 'Moderado', sevColor: 'yellow', status: 'Completado', statColor: 'green' },
    { id: '0000276', type: 'control', motive: 'Control de diabetes', date: '18/05/26 (12:00)', severity: 'Moderado', sevColor: 'yellow', status: 'Cancelado', statColor: 'slate' },
  ];

  const getBadgeClass = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'slate': default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <main className="flex-1 bg-neutral-200 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-red-700 text-3xl font-bold font-['Inter']">Historial del paciente</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Mateo Fuentes · historial clínico completo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a href="#profesional/pacientes" className="px-4 py-3 bg-white hover:bg-slate-50 transition-colors rounded-[10px] border border-slate-200 text-slate-900 text-sm font-semibold font-['Inter'] shrink-0">
            Volver a la lista
          </a>
          <button className="px-4 py-3 bg-rose-400 hover:bg-rose-500 transition-colors rounded-[10px] text-white text-sm font-semibold font-['Inter'] shrink-0">
            Nueva atención
          </button>
        </div>
      </div>

      {/* Tarjeta Resumen Principal */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-700/30 rounded-full flex justify-center items-center shrink-0">
            <span className="text-red-700 text-base font-semibold font-['Inter']">MF</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-slate-900 text-xl font-bold font-['Inter']">Mateo Fuentes</h2>
            <p className="text-slate-500 text-xs font-normal font-['Inter']">
              67 años · Masculino · ID paciente PAC-001284
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 bg-red-100 rounded-full flex justify-center items-center">
              <span className="text-red-700 text-xs font-semibold font-['Inter']">Extremo</span>
            </div>
            <div className="px-2.5 py-1 bg-blue-100 rounded-full flex justify-center items-center">
              <span className="text-blue-700 text-xs font-semibold font-['Inter']">En proceso</span>
            </div>
          </div>
          <button className="hidden md:flex px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-[10px] text-slate-900 text-sm font-semibold font-['Inter']">
            Enviar mensaje
          </button>
        </div>
      </div>

      {/* Grid de KPIs / Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-1 shadow-sm">
            <span className="text-slate-500 text-xs font-medium font-['Inter'] uppercase tracking-wide">
              {kpi.label}
            </span>
            <span className={`text-3xl font-bold font-['Inter'] ${kpi.color}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Datos Personales y de Salud (Grid 2 columnas) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 shrink-0">
        
        {/* Datos de identificación */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
          <h3 className="text-slate-900 text-base font-semibold font-['Inter'] border-b border-slate-100 pb-2">
            Datos de identificación
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Nombre completo</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate" title={patientData.name}>{patientData.name}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">RUT</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.rut}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Fecha de nacimiento</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.birthdate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Teléfono</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.phone}</span>
            </div>
            <div className="flex flex-col gap-0.5 sm:col-span-2">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Correo electrónico</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate" title={patientData.email}>{patientData.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Comuna</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.commune}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Previsión</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.prevision}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Contacto emergencia</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter'] truncate" title={patientData.emergency}>{patientData.emergency}</span>
            </div>
          </div>
        </div>

        {/* Datos de Salud */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
          <h3 className="text-slate-900 text-base font-semibold font-['Inter'] border-b border-slate-100 pb-2">
            Datos de salud
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Edad</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.age}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Sexo</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.sex}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Peso</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.weight}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Altura</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.height}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">IMC</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.imc}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Grupo sanguíneo</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.bloodType}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Crónica</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.chronic}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-xs font-medium font-['Inter']">Alergias</span>
              <span className="text-slate-900 text-sm font-semibold font-['Inter']">{patientData.allergies}</span>
            </div>
          </div>

          {/* Factores de Riesgo */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-slate-500 text-xs font-medium font-['Inter']">Factores de riesgo</span>
            <div className="flex flex-wrap gap-2">
              {patientData.riskFactors.map((factor, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold font-['Inter']">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Tabla de Citas Anteriores */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200">
          <h3 className="text-slate-900 text-base font-semibold font-['Inter']">Citas anteriores</h3>
          <span className="text-slate-500 text-xs font-normal font-['Inter']">Mostrando 5 de 14 atenciones</span>
        </div>

        {/* Header de la Tabla (Oculto en móviles) */}
        <div className="hidden md:flex items-center px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="w-20 lg:w-24 text-slate-500 text-xs font-semibold font-['Inter']">ID</div>
          <div className="w-28 lg:w-32 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Tipo</div>
          <div className="flex-1 min-w-[200px] text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Motivo</div>
          <div className="w-32 lg:w-40 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Fecha/hora</div>
          <div className="w-24 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Gravedad</div>
          <div className="w-28 text-slate-500 text-xs font-semibold font-['Inter'] uppercase">Estado</div>
          <div className="w-24"></div> 
        </div>

        {/* Cuerpo de la Tabla */}
        <div className="flex flex-col">
          {atenciones.map((row, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 gap-3 md:gap-0 hover:bg-slate-50 transition-colors ${
                index !== atenciones.length - 1 ? 'border-b border-slate-200' : ''
              }`}
            >
              
              {/* Celda: ID */}
              <div className="w-full md:w-20 lg:w-24">
                <span className="text-slate-900 text-sm font-semibold font-['Inter']">
                  <span className="md:hidden text-slate-500">ID: </span>{row.id}
                </span>
              </div>

              {/* Celda: Tipo */}
              <div className="w-full md:w-28 lg:w-32">
                <span className="text-slate-600 text-sm font-normal font-['Inter'] capitalize">
                  <span className="md:hidden font-semibold">Tipo: </span>{row.type}
                </span>
              </div>

              {/* Celda: Motivo */}
              <div className="flex-1 min-w-[200px]">
                <span className="text-slate-600 text-sm md:text-base font-normal font-['Inter'] truncate" title={row.motive}>
                  {row.motive}
                </span>
              </div>

              {/* Celda: Fecha/Hora */}
              <div className="w-full md:w-32 lg:w-40">
                <span className="text-slate-600 text-xs font-normal font-['Inter']">
                  <span className="md:hidden font-semibold">Fecha: </span>{row.date}
                </span>
              </div>

              {/* Celda: Gravedad */}
              <div className="w-full md:w-24 flex items-center">
                <span className="md:hidden text-slate-600 text-sm font-semibold font-['Inter'] mr-2">Gravedad:</span>
                <div className={`px-2.5 py-1 rounded-full flex justify-center items-center ${getBadgeClass(row.sevColor)}`}>
                  <span className="text-xs font-semibold font-['Inter']">{row.severity}</span>
                </div>
              </div>

              {/* Celda: Estado */}
              <div className="w-full md:w-28 flex items-center">
                <span className="md:hidden text-slate-600 text-sm font-semibold font-['Inter'] mr-2">Estado:</span>
                <div className={`px-2.5 py-1 rounded-full flex justify-center items-center ${getBadgeClass(row.statColor)}`}>
                  <span className="text-xs font-semibold font-['Inter']">{row.status}</span>
                </div>
              </div>

              {/* Celda: Acción */}
              <div className="w-full md:w-24 flex justify-end md:justify-center mt-2 md:mt-0">
                {/* Reutilizamos el enlace al detalle de atención que hicimos antes */}
                <a 
                  href="#profesional/detalle-atencion"
                  className="text-teal-700 hover:text-teal-800 text-xs font-semibold font-['Inter'] hover:underline"
                >
                  Ver detalles
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}