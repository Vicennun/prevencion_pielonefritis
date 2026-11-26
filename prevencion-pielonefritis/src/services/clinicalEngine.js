// Motor clínico determinista validado con el equipo médico (NefroGuía / Cero-Nefritis)
// No diagnostica ni prescribe: ordena la prioridad de seguimiento y activa reglas directas de seguridad.

export const UROCULTIVO_ESTADOS = [
  'No solicitado',
  'Solicitado: pendiente de toma',
  'Muestra recolectada/en proceso',
  'Resultado disponible: pendiente de revisión',
  'Revisado: conducta documentada',
  'Muestra rechazada o resultado no interpretable',
];

export const PRIORIDAD_ORDER = {
  URGENCIA_INMEDIATA: 0,
  ROJO: 1,
  AMARILLO: 2,
  INFORMACION_INSUFICIENTE: 3,
  VERDE: 4,
};

export const PRIORIDAD_META = {
  URGENCIA_INMEDIATA: {
    label: 'Urgencias inmediatas',
    short: 'Urgencias',
    triageEsperado: 'Revisar ahora',
    badge: 'bg-red-700 text-white border-red-800',
    border: 'border-red-600',
  },
  ROJO: {
    label: 'Valoración presencial hoy',
    short: 'Revisar ahora',
    triageEsperado: 'Revisar ahora',
    badge: 'bg-red-100 text-red-800 border-red-300',
    border: 'border-red-400',
  },
  AMARILLO: {
    label: 'Vigilar y contactar equipo',
    short: 'Hoy',
    triageEsperado: 'Hoy',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    border: 'border-amber-400',
  },
  INFORMACION_INSUFICIENTE: {
    label: 'Información insuficiente',
    short: 'Sin datos',
    triageEsperado: 'Pendiente',
    badge: 'bg-slate-200 text-slate-700 border-slate-300',
    border: 'border-slate-300',
  },
  VERDE: {
    label: 'Sin señales de alarma registradas',
    short: 'Estable',
    triageEsperado: 'Estable',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    border: 'border-emerald-300',
  },
};

export function formatearHidratacion(ml) {
  if (ml === null || ml === undefined || ml === '' || Number.isNaN(Number(ml))) {
    return 'Sin registro';
  }
  const numMl = Number(ml);
  const litros = (numMl / 1000).toLocaleString('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
  const vasos = Math.round((numMl / 250) * 10) / 10;
  return `${numMl.toLocaleString('es-CL')} mL (${litros} L · aprox. ${vasos} vasos de 250 mL)`;
}

export function ordenarPorPrioridadClinica(lista = [], getNivel = (item) => item.nivel_semaforo) {
  return [...lista].sort((a, b) => {
    const pa = PRIORIDAD_ORDER[getNivel(a)] ?? 99;
    const pb = PRIORIDAD_ORDER[getNivel(b)] ?? 99;
    return pa - pb;
  });
}

export function calcularRecurrenciaDesdeEpisodios(episodios = []) {
  const ahora = Date.now();
  const dias6m = 183 * 24 * 60 * 60 * 1000;
  const dias12m = 365 * 24 * 60 * 60 * 1000;

  let confirmados6m = 0;
  let confirmados12m = 0;

  episodios.forEach((ep) => {
    if (ep.tipo !== 'confirmado' || !ep.fecha) return;
    const ts = new Date(`${ep.fecha}T12:00:00`).getTime();
    if (Number.isNaN(ts)) return;
    const diff = ahora - ts;
    if (diff >= 0 && diff <= dias6m) confirmados6m += 1;
    if (diff >= 0 && diff <= dias12m) confirmados12m += 1;
  });

  return {
    confirmados6m,
    confirmados12m,
    esRecurrente: confirmados6m >= 2 || confirmados12m >= 3,
  };
}

export function evaluarAlertaMetabolica(datos = {}) {
  const glucosa =
    datos.glucosaCapilar !== '' && datos.glucosaCapilar !== null && datos.glucosaCapilar !== undefined
      ? Number(datos.glucosaCapilar)
      : null;

  const sintomasCetoacidosis = Boolean(
    datos.vomitosPersistentes || datos.dolorAbdominal || datos.desmayoODisnea || datos.confusionAguda || datos.confusionODeterioro
  );
  const cetonasElevadas = Boolean(datos.cetonasElevadas);

  if (glucosa === null || Number.isNaN(glucosa)) {
    return { alertaMetabolica: 'NINGUNA', mensajeMetabolico: null };
  }

  if (glucosa < 70) {
    if (datos.confusionAguda || datos.confusionODeterioro || datos.desmayoODisnea || datos.vomitosPersistentes) {
      return {
        alertaMetabolica: 'URGENCIA_METABOLICA',
        mensajeMetabolico: `Glucosa baja (${glucosa} mg/dL) con síntomas neurológicos o imposibilidad para tragar: acudir de inmediato a urgencias.`,
      };
    }
    return {
      alertaMetabolica: 'HIPOGLUCEMIA',
      mensajeMetabolico: `Glucosa capilar en ${glucosa} mg/dL (<70 mg/dL): seguir de inmediato el plan individual de hipoglucemia y avisar al equipo tratante. Si aparece confusión, convulsiones o imposibilidad para tragar, acudir a urgencias.`,
    };
  }

  if (glucosa >= 300 || cetonasElevadas || (glucosa >= 250 && sintomasCetoacidosis)) {
    return {
      alertaMetabolica: 'URGENCIA_METABOLICA',
      mensajeMetabolico: `Glucosa elevada (${glucosa} mg/dL)${sintomasCetoacidosis ? ' con síntomas de posible descompensación/cetoacidosis' : ' sostenida ≥300 mg/dL'}: requiere atención urgente y valoración metabólica inmediata.`,
    };
  }

  if (glucosa >= 250) {
    return {
      alertaMetabolica: 'HIPERGLUCEMIA_DIAS_ENFERMEDAD',
      mensajeMetabolico: `Glucosa capilar en ${glucosa} mg/dL (≥250 mg/dL): activar el plan individual de días de enfermedad, valorar cetonas si está indicado y contactar al equipo de salud hoy si persiste.`,
    };
  }

  return { alertaMetabolica: 'NINGUNA', mensajeMetabolico: null };
}

export function evaluarSemaforoClinico(datos = {}, paciente = {}) {
  const temp =
    datos.temperatura !== '' && datos.temperatura !== null && datos.temperatura !== undefined
      ? Number(datos.temperatura)
      : null;
  const dolor =
    datos.dolorLumbar !== '' && datos.dolorLumbar !== null && datos.dolorLumbar !== undefined
      ? Number(datos.dolorLumbar)
      : null;

  const antTexto = (paciente.antecedentes || []).join(' ').toLowerCase();
  const tieneEmbarazo = Boolean(datos.embarazo || paciente.embarazo || antTexto.includes('embarazo'));
  const tieneDiabetes = Boolean(datos.diabetes || antTexto.includes('diabetes'));
  const tieneErc = Boolean(datos.enfermedadRenal || antTexto.includes('enfermedad renal'));
  const tieneInm = Boolean(datos.inmunosupresion || antTexto.includes('inmunosupresi') || antTexto.includes('trasplante'));
  const tieneSonda = Boolean(datos.sondaUrinaria || antTexto.includes('sonda'));
  const tieneLitiasis = Boolean(datos.litiasisAntecedente || antTexto.includes('cálculo') || antTexto.includes('litiasis'));
  const tieneObstruccion = Boolean(datos.obstruccionSospechada || antTexto.includes('obstrucción'));
  const tieneInstrumentacion = Boolean(datos.instrumentacionReciente || antTexto.includes('instrumentación'));

  const itu6m = Number(datos.ituConfirmadas6m ?? paciente.itu6Meses ?? paciente.itu_6_meses ?? 0);
  const itu12m = Number(datos.ituConfirmadas12m ?? paciente.itu12Meses ?? paciente.itu_12_meses ?? 0);
  const esRecurrente = Boolean(datos.esRecurrente || itu6m >= 2 || itu12m >= 3);

  // Contexto de IVU: en seguimiento activo se asume contexto urinario;
  // en autochequeo o evaluación inicial (requiereContextoItu = true), la fiebre aislada requiere contexto urinario para marcar sospecha renal.
  const tieneContextoItu =
    !datos.requiereContextoItu ||
    Boolean(
      datos.enSeguimientoItu ||
        datos.sintomasUrinarios ||
        datos.dolorFlanco ||
        datos.sangreOrina ||
        datos.coagulosRetencion ||
        datos.disminucionOrina ||
        esRecurrente
    );

  const fiebreEnContextoItu = temp !== null && temp >= 38.0 && tieneContextoItu;
  const fiebreAisladaSinContexto = temp !== null && temp >= 38.0 && !tieneContextoItu;

  const toleraViaOral = datos.toleraLiquidosMedicamentos !== false && !datos.vomitosPersistentes;
  const tieneSintomasSistemicos = Boolean(
    fiebreEnContextoItu || datos.escalofriosTemblor || datos.dolorFlanco || datos.vomitosPersistentes
  );

  // 1) Evaluación metabólica paralela
  const { alertaMetabolica, mensajeMetabolico } = evaluarAlertaMetabolica(datos);

  // 2) Triggers de URGENCIA INMEDIATA
  const triggersUrgencia = [];
  if (datos.confusionAguda || datos.confusionODeterioro) {
    triggersUrgencia.push('Confusión o somnolencia de nueva aparición / deterioro agudo');
  }
  if (datos.desmayoODisnea) {
    triggersUrgencia.push('Desmayo, dificultad respiratoria, hipotensión o deterioro rápido');
  }
  if (datos.coagulosRetencion) {
    triggersUrgencia.push('Sangre en orina con coágulos o dificultad para orinar (retención)');
  }
  if (tieneObstruccion && (tieneSintomasSistemicos || (dolor !== null && dolor >= 7))) {
    triggersUrgencia.push('Sospecha de obstrucción urinaria con infección o dolor intenso');
  }
  if (temp !== null && temp >= 38.0 && datos.vomitosPersistentes) {
    triggersUrgencia.push('Fiebre ≥ 38 °C junto con vómitos persistentes / intolerancia oral');
  }
  if (tieneEmbarazo && tieneSintomasSistemicos) {
    triggersUrgencia.push('Embarazo con signos de sospecha de pielonefritis (valoración obstétrica/urgente)');
  }

  // 3) Triggers de ROJO (valoración presencial el mismo día)
  const triggersRojo = [];
  if (fiebreEnContextoItu) {
    triggersRojo.push(`Fiebre (${temp} °C ≥ 38.0 °C) en contexto de IVU o seguimiento urinario`);
  }
  if (datos.escalofriosTemblor) triggersRojo.push('Escalofríos intensos con temblor');
  if (datos.dolorFlanco) triggersRojo.push('Dolor nuevo o creciente en costado o región lumbar');
  if (dolor !== null && dolor >= 7) triggersRojo.push(`Dolor intenso (${dolor}/10)`);
  if (!toleraViaOral) triggersRojo.push('Vómitos persistentes o incapacidad para hidratarse / tomar tratamiento');
  if (datos.disminucionOrina) triggersRojo.push('Disminución importante de la cantidad de orina (diuresis)');
  if (Number(datos.horasSinMejoria || 0) >= 48) {
    triggersRojo.push('Sin mejoría tras 48–72 horas de tratamiento indicado');
  }

  // 4) Triggers de AMARILLO (vigilar, registrar y contactar al equipo de salud)
  const triggersAmarillo = [];
  if (fiebreAisladaSinContexto) {
    triggersAmarillo.push(`Fiebre aislada (${temp} °C) sin síntomas urinarios ni contexto de IVU activa`);
  }
  if (temp !== null && temp >= 37.5 && temp < 38.0) triggersAmarillo.push(`Febrícula (${temp} °C)`);
  if (dolor !== null && dolor >= 4 && dolor <= 6) triggersAmarillo.push(`Dolor moderado (${dolor}/10)`);
  if (datos.sintomasUrinarios) triggersAmarillo.push('Síntomas urinarios bajos nuevos o persistentes');
  if (datos.sangreOrina && !datos.coagulosRetencion) {
    triggersAmarillo.push('Sangre visible en orina (requiere valoración pronta)');
  }
  if (tieneEmbarazo && datos.sintomasUrinarios && !tieneSintomasSistemicos) {
    triggersAmarillo.push('Embarazo con síntomas urinarios (valoración pronta)');
  }
  if (tieneInstrumentacion && (datos.sintomasUrinarios || (dolor !== null && dolor >= 4) || (temp !== null && temp >= 37.5))) {
    triggersAmarillo.push('Síntomas tras instrumentación o cirugía urinaria reciente');
  }
  if (tieneLitiasis && ((dolor !== null && dolor >= 2) || datos.dolorTipoColico)) {
    triggersAmarillo.push('Antecedente de litiasis con dolor o molestia (descartar obstrucción)');
  }
  if (esRecurrente && triggersRojo.length === 0 && triggersUrgencia.length === 0) {
    triggersAmarillo.push(`Infecciones urinarias recurrentes (${itu6m} en 6m / ${itu12m} en 12m): seguimiento preventivo`);
  }
  if (
    (datos.adherenciaPorcentaje !== undefined && datos.adherenciaPorcentaje !== null && Number(datos.adherenciaPorcentaje) < 80) ||
    Number(datos.dosisOmitidas || 0) > 0 ||
    datos.efectosAdversos
  ) {
    triggersAmarillo.push('Dificultades de adherencia, dosis omitidas o efectos adversos (contacto de apoyo)');
  }
  if (alertaMetabolica === 'HIPERGLUCEMIA_DIAS_ENFERMEDAD' || alertaMetabolica === 'HIPOGLUCEMIA') {
    triggersAmarillo.push('Alerta metabólica de glucosa que requiere contacto hoy');
  }

  // Modificadores de contexto (NO suman puntos automáticos para urgencia por sí solos)
  const modificadores = [];
  if (tieneDiabetes) modificadores.push('Antecedente: Diabetes mellitus');
  if (tieneErc) modificadores.push('Antecedente: Enfermedad renal crónica');
  if (tieneInm) modificadores.push('Antecedente: Inmunosupresión o trasplante');
  if (tieneSonda) modificadores.push('Dispositivo: Sonda urinaria');

  // 5) Valoración de estudio de imagen (solo sugerencia para criterio profesional)
  const razonesImagen = [];
  if (Number(datos.horasSinMejoria || 0) >= 48) razonesImagen.push('sin mejoría en 48–72 horas');
  if (tieneObstruccion || (tieneLitiasis && tieneSintomasSistemicos)) razonesImagen.push('sospecha de litiasis u obstrucción');
  if (datos.disminucionOrina) razonesImagen.push('disminución de diuresis / valorar función renal');
  if ((tieneDiabetes || tieneInm) && tieneSintomasSistemicos) {
    razonesImagen.push('pielonefritis con diabetes o inmunosupresión (valorar imagen temprana según criterio clínico)');
  }

  const alertaReevaluacionImagen = razonesImagen.length > 0;
  const mensajeReevaluacionImagen = alertaReevaluacionImagen
    ? `Sugerencia para criterio profesional: valorar estudio de imagen (${razonesImagen.join('; ')}). En embarazo preferir ecografía o resonancia según indicación clínica.`
    : null;

  const faltanEsenciales =
    temp === null &&
    dolor === null &&
    triggersUrgencia.length === 0 &&
    triggersRojo.length === 0 &&
    triggersAmarillo.length === 0;

  if (triggersUrgencia.length > 0 || alertaMetabolica === 'URGENCIA_METABOLICA') {
    const todos = [...triggersUrgencia];
    if (alertaMetabolica === 'URGENCIA_METABOLICA') todos.push('Alerta metabólica urgente de glucosa');
    return {
      nivelSemaforo: 'URGENCIA_INMEDIATA',
      tituloSemaforo: 'Atención de urgencias recomendada',
      mensajeProtocolo:
        'Tus respuestas muestran señales que requieren atención inmediata en un servicio de urgencias o llamar a emergencias (131 en Chile / 911 en México), sin esperar a que aparezcan otros signos. Esta herramienta no realiza diagnósticos.',
      triggersActivos: [...todos, ...triggersRojo, ...modificadores],
      alertaMetabolica,
      mensajeMetabolico,
      alertaReevaluacionImagen,
      mensajeReevaluacionImagen,
    };
  }

  if (triggersRojo.length > 0) {
    return {
      nivelSemaforo: 'ROJO',
      tituloSemaforo: 'Valoración profesional el mismo día',
      mensajeProtocolo:
        'Tus respuestas indican que necesitas valoración presencial con un profesional de la salud hoy. Esto no es un diagnóstico. Si aparece confusión, desmayo, dificultad respiratoria o empeoras rápido, acude a urgencias o llama a emergencias.',
      triggersActivos: [...triggersRojo, ...modificadores],
      alertaMetabolica,
      mensajeMetabolico,
      alertaReevaluacionImagen,
      mensajeReevaluacionImagen,
    };
  }

  if (triggersAmarillo.length > 0) {
    const mensajeAmarillo = fiebreAisladaSinContexto && triggersAmarillo.length === 1
      ? `Registraste fiebre (${temp} °C) sin síntomas urinarios ni contexto de infección urinaria activa. Por sí sola no apunta a pielonefritis, pero conviene consultar con un profesional para evaluar su causa y buscar valoración el mismo día si aparecen ardor al orinar, dolor en costado/espalda baja, escalofríos o empeoramiento.`
      : 'Tus respuestas sugieren vigilar tu evolución y contactar a tu equipo de salud para orientar el plan o seguimiento preventivo. Si aparece fiebre ≥ 38 °C con síntomas urinarios, escalofríos, dolor en costado/espalda baja, vómitos persistentes o empeoramiento, busca valoración presencial el mismo día.';

    return {
      nivelSemaforo: 'AMARILLO',
      tituloSemaforo: fiebreAisladaSinContexto && triggersAmarillo.length === 1
        ? 'Fiebre aislada sin signos urinarios'
        : 'Vigilar evolución y contactar al equipo',
      mensajeProtocolo: mensajeAmarillo,
      triggersActivos: [...triggersAmarillo, ...modificadores],
      alertaMetabolica,
      mensajeMetabolico,
      alertaReevaluacionImagen,
      mensajeReevaluacionImagen,
    };
  }

  if (faltanEsenciales) {
    return {
      nivelSemaforo: 'INFORMACION_INSUFICIENTE',
      tituloSemaforo: 'Información insuficiente para orientar',
      mensajeProtocolo:
        'Faltan mediciones esenciales (temperatura y nivel de dolor). Completa tu registro para orientar el seguimiento; la falta de datos no equivale a estar sin riesgo.',
      triggersActivos: ['Faltan mediciones esenciales (temperatura o dolor)'],
      alertaMetabolica,
      mensajeMetabolico,
      alertaReevaluacionImagen: false,
      mensajeReevaluacionImagen: null,
    };
  }

  return {
    nivelSemaforo: 'VERDE',
    tituloSemaforo: 'Sin señales de alarma registradas',
    mensajeProtocolo:
      'No se registran señales de alarma en este chequeo. Continúa tu seguimiento y el tratamiento exactamente como fue indicado; este resultado no confirma curación ni descarta infección.',
    triggersActivos: modificadores.length ? modificadores : ['Campos esenciales completos sin criterios de alarma'],
    alertaMetabolica,
    mensajeMetabolico,
    alertaReevaluacionImagen: false,
    mensajeReevaluacionImagen: null,
  };
}