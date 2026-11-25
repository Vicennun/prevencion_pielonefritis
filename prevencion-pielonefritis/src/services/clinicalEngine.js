// Motor clínico determinista validado para Cero Nefritis (sin IA ni puntajes sumativos para urgencia aguda)

export const UROCULTIVO_ESTADOS = [
  'No solicitado',
  'Solicitado: pendiente de toma',
  'Muestra recolectada/en proceso',
  'Resultado disponible: pendiente de revisión',
  'Revisado: conducta documentada',
  'Muestra rechazada o resultado no interpretable',
];

export const PRIORIDAD_RANK = {
  URGENCIA_INMEDIATA: 1,
  ROJO: 2,
  AMARILLO: 3,
  INFORMACION_INSUFICIENTE: 4,
  VERDE: 5,
};

export const PRIORIDAD_META = {
  URGENCIA_INMEDIATA: {
    label: 'Urgencias inmediatas',
    short: 'Urgencia',
    color: 'red',
    border: 'border-red-700',
    bgSoft: 'bg-red-50',
    badge: 'bg-red-700 text-white border-red-800',
  },
  ROJO: {
    label: 'Valoración presencial hoy',
    short: 'Rojo · Hoy',
    color: 'red',
    border: 'border-red-500',
    bgSoft: 'bg-red-50',
    badge: 'bg-red-100 text-red-700 border-red-200',
  },
  AMARILLO: {
    label: 'Vigilar y contactar equipo',
    short: 'Amarillo',
    color: 'amber',
    border: 'border-amber-500',
    bgSoft: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  INFORMACION_INSUFICIENTE: {
    label: 'Información insuficiente',
    short: 'Incompleto',
    color: 'slate',
    border: 'border-slate-400',
    bgSoft: 'bg-slate-50',
    badge: 'bg-slate-200 text-slate-700 border-slate-300',
  },
  VERDE: {
    label: 'Sin señales de alarma registradas',
    short: 'Verde',
    color: 'green',
    border: 'border-green-500',
    bgSoft: 'bg-green-50',
    badge: 'bg-green-100 text-green-700 border-green-200',
  },
};

/**
 * Alerta metabólica paralela para glucosa capilar (no se interpreta como gravedad infecciosa).
 */
export function evaluarAlertaMetabolica({ glucosa, confusionODeterioro = false, vomitosPersistentes = false }) {
  if (glucosa === null || glucosa === undefined || glucosa === '') {
    return { nivel: 'NINGUNA', mensaje: null };
  }
  const g = Number(glucosa);
  if (Number.isNaN(g)) return { nivel: 'NINGUNA', mensaje: null };

  if (g < 70) {
    if (confusionODeterioro || vomitosPersistentes) {
      return {
        nivel: 'URGENCIA_METABOLICA',
        mensaje: `Hipoglucemia crítica (${g} mg/dL) con signos de alarma: acudir a urgencias inmediatas.`,
      };
    }
    return {
      nivel: 'HIPOGLUCEMIA',
      mensaje: `Glucosa < 70 mg/dL (${g} mg/dL): activar de inmediato el plan individual de hipoglucemia.`,
    };
  }

  if (g >= 300 || (g >= 250 && vomitosPersistentes)) {
    return {
      nivel: 'URGENCIA_METABOLICA',
      mensaje: `Glucosa elevada (${g} mg/dL)${vomitosPersistentes ? ' con vómitos persistentes' : ''}: riesgo de descompensación/cetoacidosis, requiere atención urgente.`,
    };
  }

  if (g >= 250) {
    return {
      nivel: 'DIAS_ENFERMEDAD',
      mensaje: `Glucosa ≥ 250 mg/dL (${g} mg/dL) durante enfermedad: activar plan de días de enfermedad, valorar cetonas y contactar al equipo si persiste.`,
    };
  }

  return { nivel: 'NINGUNA', mensaje: null };
}

/**
 * Evalúa el Semáforo Clínico Determinista (usado en Check-in Diario y Evaluación Inicial).
 * Nota: < 6 vasos de agua y náuseas aisladas NO disparan alerta roja/amarilla por sí solas.
 */
export function evaluarSemaforoClinico(datos = {}, perfil = {}) {
  const temp = datos.temperatura !== undefined && datos.temperatura !== '' && datos.temperatura !== null
    ? Number(datos.temperatura)
    : null;
  const dolor = datos.dolorLumbar !== undefined && datos.dolorLumbar !== '' && datos.dolorLumbar !== null
    ? Number(datos.dolorLumbar)
    : null;

  const confusion = Boolean(datos.confusionODeterioro || datos.confusionAguda || datos.desmayoODisnea || datos.hipotensionDeterioro);
  const obstruccionInfectada = Boolean(datos.obstruccionSospechada) && (temp >= 37.5 || Boolean(datos.sintomasUrinarios) || Boolean(datos.dolorFlanco));
  const coagulosRetencion = Boolean(datos.coagulosRetencion);
  const fiebre = temp !== null && temp >= 38.0;
  const febricula = temp !== null && temp >= 37.5 && temp < 38.0;
  const dolorAlto = dolor !== null && dolor >= 7;
  const dolorModerado = dolor !== null && dolor >= 4 && dolor < 7;
  const escalofrios = Boolean(datos.escalofriosTemblor);
  const vomitosPersistentes = Boolean(datos.vomitosPersistentes) || datos.toleraLiquidosMedicamentos === false;
  const dolorFlancoNuevo = Boolean(datos.dolorFlanco);
  const sangreOrina = Boolean(datos.sangreOrina);
  const sintomasUrinarios = Boolean(datos.sintomasUrinarios);
  const sinMejoria48_72h = Number(datos.horasSinMejoria || 0) >= 48 && (febricula || fiebre || dolorModerado || dolorAlto || sintomasUrinarios);
  const bajaAdherencia = (datos.adherenciaPorcentaje !== undefined && Number(datos.adherenciaPorcentaje) < 80) || Number(datos.dosisOmitidas || 0) > 0;

  const embarazo = Boolean(datos.embarazo ?? perfil.embarazo);
  const diabetes = Boolean(datos.diabetes ?? perfil.antecedentes?.some(a => a.toLowerCase().includes('diabetes')));
  const inmunosupresion = Boolean(datos.inmunosupresion ?? perfil.antecedentes?.some(a => a.toLowerCase().includes('inmunosupresi')));
  const instrumentacion = Boolean(datos.instrumentacionReciente ?? perfil.antecedentes?.some(a => a.toLowerCase().includes('instrumentaci')));
  const esRecurrente = Boolean(datos.esRecurrente) || Number(perfil.itu_6_meses || 0) >= 2 || Number(perfil.itu_12_meses || 0) >= 3;

  const metabolica = evaluarAlertaMetabolica({
    glucosa: datos.glucosaCapilar,
    confusionODeterioro: confusion,
    vomitosPersistentes,
  });

  // Alerta de valoración de estudio de imagen (nunca orden automática)
  const alertaImagen =
    obstruccionInfectada ||
    sinMejoria48_72h ||
    ((fiebre || dolorAlto) && (diabetes || inmunosupresion || embarazo));

  let mensajeImagen = null;
  if (alertaImagen) {
    mensajeImagen = embarazo
      ? 'Valorar necesidad de estudio de imagen según criterio clínico (en embarazo preferir ecografía; evitar radiación).'
      : 'Evolución o factores de riesgo ameritan valorar necesidad de estudio de imagen (ecografía o TAC según criterio profesional).';
  }

  const triggers = [];

  // 1. URGENCIA INMEDIATA
  if (confusion) triggers.push('Confusión nueva, desmayo, dificultad respiratoria o deterioro rápido');
  if (obstruccionInfectada) triggers.push('Sospecha de obstrucción urinaria con infección');
  if (coagulosRetencion) triggers.push('Sangre en orina con coágulos o dificultad para orinar');
  if (metabolica.nivel === 'URGENCIA_METABOLICA') triggers.push('Urgencia metabólica (glucosa crítica / cetoacidosis)');

  if (triggers.length > 0) {
    return {
      nivelSemaforo: 'URGENCIA_INMEDIATA',
      tituloSemaforo: 'Urgencias inmediatas',
      mensajeProtocolo: 'Se detectaron signos de deterioro grave o urgencia urológica/metabólica. Acudir a urgencias inmediatas sin esperar consulta programada (la ausencia de fiebre no descarta gravedad).',
      triggersActivos: triggers,
      alertaMetabolica: metabolica.nivel,
      mensajeMetabolico: metabolica.mensaje,
      alertaReevaluacionImagen: alertaImagen,
      mensajeReevaluacionImagen: mensajeImagen,
    };
  }

  // 2. ROJO — Valoración presencial el mismo día
  if (fiebre) triggers.push(`Fiebre ≥ 38 °C (${temp} °C)`);
  if (escalofrios) triggers.push('Escalofríos intensos con temblor');
  if (dolorAlto) triggers.push(`Dolor intenso ≥ 7/10 (${dolor}/10)`);
  if (dolorFlancoNuevo && !dolorAlto) triggers.push('Dolor nuevo o creciente en flanco/región lumbar');
  if (vomitosPersistentes) triggers.push('Vómitos persistentes o incapacidad para hidratarse/medicarse');
  if (sinMejoria48_72h) triggers.push('Falta de mejoría en 48–72 horas');
  if (embarazo && (fiebre || dolorFlancoNuevo || dolorModerado || dolorAlto || vomitosPersistentes)) {
    triggers.push('Embarazo con sospecha de pielonefritis (prioridad obstétrica)');
  }

  if (triggers.length > 0) {
    return {
      nivelSemaforo: 'ROJO',
      tituloSemaforo: embarazo ? 'Evaluación presencial urgente (Obstétrica)' : 'Valoración presencial el mismo día',
      mensajeProtocolo: 'Tus respuestas indican que necesitas valoración profesional presencial hoy mismo. Esto no es un diagnóstico; si aparece confusión, desmayo, dificultad respiratoria o empeoras rápido, acude a urgencias.',
      triggersActivos: triggers,
      alertaMetabolica: metabolica.nivel,
      mensajeMetabolico: metabolica.mensaje,
      alertaReevaluacionImagen: alertaImagen,
      mensajeReevaluacionImagen: mensajeImagen,
    };
  }

  // 3. INFORMACIÓN INSUFICIENTE (si faltan campos esenciales: temperatura y dolor)
  const faltanEsenciales = temp === null || dolor === null;
  if (faltanEsenciales && !sintomasUrinarios && !sangreOrina && !bajaAdherencia) {
    return {
      nivelSemaforo: 'INFORMACION_INSUFICIENTE',
      tituloSemaforo: 'Información insuficiente',
      mensajeProtocolo: 'Faltan campos esenciales (temperatura y escala de dolor) para clasificar el seguimiento. No se asigna nivel verde sin datos completos.',
      triggersActivos: ['Faltan campos esenciales del registro'],
      alertaMetabolica: metabolica.nivel,
      mensajeMetabolico: metabolica.mensaje,
      alertaReevaluacionImagen: false,
      mensajeReevaluacionImagen: null,
    };
  }

  // 4. AMARILLO — Vigilar, registrar y contactar equipo
  if (febricula) triggers.push(`Temperatura 37.5–37.9 °C (${temp} °C)`);
  if (dolorModerado) triggers.push(`Dolor moderado 4–6/10 (${dolor}/10)`);
  if (sangreOrina) triggers.push('Sangre visible en orina (requiere valoración pronta)');
  if (embarazo && sintomasUrinarios) triggers.push('Embarazo con síntomas urinarios (valoración pronta)');
  if (instrumentacion && (sintomasUrinarios || febricula || dolorModerado)) triggers.push('Instrumentación urinaria reciente con síntomas');
  if (sintomasUrinarios) triggers.push('Síntomas urinarios nuevos o persistentes sin criterios rojos');
  if (bajaAdherencia) triggers.push('Dosis omitidas o dificultad de adherencia (requiere apoyo clínico)');
  if (metabolica.nivel === 'DIAS_ENFERMEDAD' || metabolica.nivel === 'HIPOGLUCEMIA') {
    triggers.push('Alerta metabólica paralela de glucosa');
  }
  if (esRecurrente && triggers.length === 0) {
    triggers.push('Recurrencia documentada (≥ 2 en 6m o ≥ 3 en 12m): seguimiento programado');
  }

  if (triggers.length > 0) {
    return {
      nivelSemaforo: 'AMARILLO',
      tituloSemaforo: 'Vigilar, registrar y contactar equipo',
      mensajeProtocolo: 'Registra tu evolución y contacta al equipo de salud. Si aparece fiebre ≥ 38 °C, escalofríos intensos, dolor en flanco creciente o vómitos persistentes, busca valoración el mismo día.',
      triggersActivos: triggers,
      alertaMetabolica: metabolica.nivel,
      mensajeMetabolico: metabolica.mensaje,
      alertaReevaluacionImagen: alertaImagen,
      mensajeReevaluacionImagen: mensajeImagen,
    };
  }

  // 5. VERDE — Solo cuando campos esenciales están completos y sin criterios de alarma
  return {
    nivelSemaforo: 'VERDE',
    tituloSemaforo: 'Sin señales de alarma registradas',
    mensajeProtocolo: 'Sin señales de alarma registradas en tu último control. Continúa tu seguimiento y el tratamiento indicado (este resultado no confirma curación ni descarta infección).',
    triggersActivos: ['Campos esenciales completos', 'Sin señales de alarma registradas'],
    alertaMetabolica: metabolica.nivel,
    mensajeMetabolico: metabolica.mensaje,
    alertaReevaluacionImagen: false,
    mensajeReevaluacionImagen: null,
  };
}

/**
 * Ordena pacientes/seguimientos según prioridad clínica real.
 */
export function ordenarPorPrioridadClinica(lista, selectorNivel = (item) => item.nivel_semaforo) {
  return [...lista].sort((a, b) => {
    const rankA = PRIORIDAD_RANK[selectorNivel(a)] ?? 99;
    const rankB = PRIORIDAD_RANK[selectorNivel(b)] ?? 99;
    return rankA - rankB;
  });
}

/**
 * Helper de hidratación: 1 vaso de referencia = 250 mL.
 */
export function formatearHidratacion(ml) {
  if (ml === null || ml === undefined) return 'Sin registro';
  const litros = (ml / 1000).toFixed(2).replace('.', ',');
  const vasos = Math.round((ml / 250) * 10) / 10;
  return `${ml} mL (${litros} L · ~${vasos} vasos)`;
}