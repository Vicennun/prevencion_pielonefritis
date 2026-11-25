import { supabase } from './supabaseClient';
import { evaluarSemaforoClinico, ordenarPorPrioridadClinica } from './clinicalEngine';

const BUCKET = 'archivos-clinicos';

// Normaliza usuario para mantener compatibilidad con Sidebar y componentes existentes
export function mapUsuario(u) {
  if (!u) return null;
  return {
    ...u,
    nombreCompleto: u.nombre_completo,
    fechaNacimiento: u.fecha_nacimiento,
    contactoEmergencia: u.contacto_emergencia,
    grupoSanguineo: u.grupo_sanguineo,
    medicamentosActuales: u.medicamentos_actuales,
    semanasGestacion: u.semanas_gestacion,
    restriccionHidrica: u.restriccion_hidrica,
    metaHidricaMl: u.meta_hidrica_ml,
    metaHidricaNota: u.meta_hidrica_nota,
    itu6Meses: u.itu_6_meses,
    itu12Meses: u.itu_12_meses,
  };
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('ceroNefritisUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function sanitizarNombreArchivo(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

export const api = {
  // ==========================================
  // 1. AUTENTICACIÓN Y USUARIOS
  // ==========================================
  async registrar({ nombreCompleto, email, password, rol }) {
    const cleanEmail = email.trim().toLowerCase();
    const rolNormalizado = rol === 'ADMINISTRADOR' ? 'ADMIN' : (rol || 'PACIENTE').toUpperCase();

    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existente) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre_completo: nombreCompleto.trim(),
        email: cleanEmail,
        password,
        rol: rolNormalizado,
        rut: `PENDIENTE-${Date.now()}`,
        especialidad: rolNormalizado === 'PROFESIONAL' ? 'Profesional de Salud' : null,
        consentimiento_informado: true,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapUsuario(data);
  },

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data || data.password !== password) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    return mapUsuario(data);
  },

  async getUsuario(id) {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return mapUsuario(data);
  },

  async getPacientes() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', 'PACIENTE')
      .order('nombre_completo', { ascending: true });
    if (error) throw new Error(error.message);
    return data.map(mapUsuario);
  },

  async getProfesionales() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', 'PROFESIONAL')
      .order('nombre_completo', { ascending: true });
    if (error) throw new Error(error.message);
    return data.map(mapUsuario);
  },

  async actualizarUsuario(id, campos) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(campos)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapUsuario(data);
  },

  // ==========================================
  // 2. EVALUACIONES DE RIESGO (FORMULARIO CLÍNICO)
  // ==========================================
  async crearEvaluacion(pacienteId, form) {
    const paciente = await this.getUsuario(pacienteId);
    const esRecurrente = Number(form.ituConfirmadas6m || 0) >= 2 || Number(form.ituConfirmadas12m || 0) >= 3;

    const resultado = evaluarSemaforoClinico(
      {
        temperatura: form.temperatura,
        dolorLumbar: form.dolorIntensidad,
        dolorFlanco: form.dolorFlancoLumbar,
        escalofriosTemblor: form.escalofriosTemblor,
        vomitosPersistentes: form.vomitosPersistentes,
        sintomasUrinarios: form.sintomasUrinariosBajos,
        sangreOrina: form.sangreOrina,
        coagulosRetencion: form.coagulosRetencion,
        confusionAguda: form.confusionAguda,
        desmayoODisnea: form.desmayoODisnea,
        obstruccionSospechada: form.obstruccionSospechada,
        embarazo: form.embarazo,
        diabetes: form.diabetes,
        inmunosupresion: form.inmunosupresion,
        instrumentacionReciente: form.instrumentacionReciente,
        esRecurrente,
      },
      paciente
    );

    // Actualizar antecedentes en texto completo en el perfil del paciente
    const antecedentes = [];
    if (form.diabetes) antecedentes.push('Diabetes mellitus');
    if (form.enfermedadRenal) antecedentes.push('Enfermedad renal crónica');
    if (form.litiasisAntecedente) antecedentes.push('Antecedente de cálculos urinarios');
    if (form.obstruccionSospechada) antecedentes.push('Sospecha de obstrucción urinaria');
    if (form.inmunosupresion) antecedentes.push('Inmunosupresión o trasplante');
    if (form.sondaUrinaria) antecedentes.push('Sonda urinaria');
    if (form.instrumentacionReciente) antecedentes.push('Instrumentación o cirugía urinaria reciente');
    if (form.embarazo) {
      antecedentes.push(form.semanasGestacion ? `Embarazo (${form.semanasGestacion} semanas)` : 'Embarazo o posible embarazo');
    }
    if (esRecurrente) antecedentes.push('Infecciones urinarias recurrentes');

    await supabase
      .from('usuarios')
      .update({
        antecedentes: antecedentes.length ? antecedentes : ['Sin antecedentes de riesgo'],
        embarazo: Boolean(form.embarazo),
        semanas_gestacion: form.semanasGestacion ? Number(form.semanasGestacion) : null,
        restriccion_hidrica: Boolean(form.restriccionHidrica),
        alergias: form.alergias || paciente.alergias,
        medicamentos_actuales: form.medicamentosActuales || paciente.medicamentos_actuales,
        itu_6_meses: Number(form.ituConfirmadas6m || 0),
        itu_12_meses: Number(form.ituConfirmadas12m || 0),
      })
      .eq('id', pacienteId);

    const { data, error } = await supabase
      .from('evaluaciones_riesgo')
      .insert({
        paciente_id: pacienteId,
        embarazo: Boolean(form.embarazo),
        semanas_gestacion: form.semanasGestacion ? Number(form.semanasGestacion) : null,
        diabetes: Boolean(form.diabetes),
        enfermedad_renal: Boolean(form.enfermedadRenal),
        enfermedad_renal_detalle: form.enfermedadRenalDetalle || null,
        litiasis_antecedente: Boolean(form.litiasisAntecedente),
        obstruccion_sospechada: Boolean(form.obstruccionSospechada),
        inmunosupresion: Boolean(form.inmunosupresion),
        sonda_urinaria: Boolean(form.sondaUrinaria),
        instrumentacion_reciente: Boolean(form.instrumentacionReciente),
        itu_confirmadas_6m: Number(form.ituConfirmadas6m || 0),
        itu_confirmadas_12m: Number(form.ituConfirmadas12m || 0),
        es_recurrente: esRecurrente,
        restriccion_hidrica: Boolean(form.restriccionHidrica),
        fiebre_mayor_38: Number(form.temperatura || 0) >= 38,
        escalofrios_temblor: Boolean(form.escalofriosTemblor),
        dolor_flanco_lumbar: Boolean(form.dolorFlancoLumbar),
        dolor_intensidad: form.dolorIntensidad !== '' ? Number(form.dolorIntensidad) : 0,
        vomitos_persistentes: Boolean(form.vomitosPersistentes),
        sintomas_urinarios_bajos: Boolean(form.sintomasUrinariosBajos),
        sangre_orina: Boolean(form.sangreOrina),
        coagulos_retencion: Boolean(form.coagulosRetencion),
        confusion_aguda: Boolean(form.confusionAguda),
        desmayo_o_disnea: Boolean(form.desmayoODisnea),
        alergias: form.alergias || null,
        medicamentos_actuales: form.medicamentosActuales || null,
        observaciones: form.observaciones || null,
        nivel_prioridad: resultado.nivelSemaforo,
        motivos_prioridad: resultado.triggersActivos,
        recomendacion: resultado.mensajeProtocolo,
        estado_atencion: 'EN_PROCESO',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { evaluacion: data, resultado };
  },

  async getEvaluacionesPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('evaluaciones_riesgo')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('fecha_evaluacion', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  // ==========================================
  // 3. SEGUIMIENTO ACTIVO, CHECK-INS Y PANEL MÉDICO
  // ==========================================
  async getSeguimientos() {
    const { data, error } = await supabase
      .from('seguimientos_activos')
      .select('*, paciente:usuarios!seguimientos_activos_paciente_id_fkey(*)')
      .eq('activo', true);
    if (error) throw new Error(error.message);

    const mapped = data.map((s) => ({
      ...s,
      paciente: mapUsuario(s.paciente),
    }));
    return ordenarPorPrioridadClinica(mapped, (item) => item.nivel_semaforo);
  },

  async getSeguimientoPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('seguimientos_activos')
      .select('*, paciente:usuarios!seguimientos_activos_paciente_id_fkey(*)')
      .eq('paciente_id', pacienteId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? { ...data, paciente: mapUsuario(data.paciente) } : null;
  },

  async getCheckins(seguimientoId) {
    const { data, error } = await supabase
      .from('checkins_diarios')
      .select('*')
      .eq('seguimiento_id', seguimientoId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async registrarCheckin(pacienteId, metricas) {
    let seg = await this.getSeguimientoPaciente(pacienteId);
    const paciente = seg?.paciente || (await this.getUsuario(pacienteId));

    // Si el paciente aún no tenía seguimiento activo, creamos uno base
    if (!seg) {
      const { data: nuevo, error: errCrear } = await supabase
        .from('seguimientos_activos')
        .insert({
          paciente_id: pacienteId,
          diagnostico: 'Seguimiento Clínico Urinario',
          dia_actual: 1,
          total_dias: 7,
          antibiotico_actual: paciente.medicamentos_actuales || 'Según indicación profesional',
        })
        .select()
        .single();
      if (errCrear) throw new Error(errCrear.message);
      seg = { ...nuevo, paciente };
    }

    const mlHidratacion =
      metricas.mlHidratacion !== undefined && metricas.mlHidratacion !== ''
        ? Number(metricas.mlHidratacion)
        : metricas.vasosHidratacion !== undefined && metricas.vasosHidratacion !== ''
          ? Number(metricas.vasosHidratacion) * 250
          : null;

    const vasosHidratacion = mlHidratacion !== null ? Math.round(mlHidratacion / 250) : null;

    const evalRes = evaluarSemaforoClinico(
      {
        temperatura: metricas.temperatura,
        dolorLumbar: metricas.dolorLumbar,
        dolorFlanco: metricas.dolorFlanco,
        escalofriosTemblor: metricas.escalofriosTemblor,
        vomitosPersistentes: metricas.vomitosPersistentes,
        toleraLiquidosMedicamentos: metricas.toleraLiquidosMedicamentos,
        sintomasUrinarios: metricas.sintomasUrinarios,
        sangreOrina: metricas.sangreOrina,
        coagulosRetencion: metricas.coagulosRetencion,
        confusionODeterioro: metricas.confusionODeterioro,
        glucosaCapilar: metricas.glucosaCapilar,
        dosisOmitidas: metricas.tomoTratamiento === false ? (seg.dosis_omitidas || 0) + 1 : seg.dosis_omitidas || 0,
        horasSinMejoria: seg.horas_sin_mejoria || 0,
      },
      paciente
    );

    // 1. Insertar registro histórico diario
    const { error: errCheck } = await supabase.from('checkins_diarios').insert({
      seguimiento_id: seg.id,
      paciente_id: pacienteId,
      dia_tratamiento: seg.dia_actual || 1,
      temperatura: metricas.temperatura !== '' && metricas.temperatura !== undefined ? Number(metricas.temperatura) : null,
      dolor_lumbar: metricas.dolorLumbar !== '' && metricas.dolorLumbar !== undefined ? Number(metricas.dolorLumbar) : null,
      ml_hidratacion: mlHidratacion,
      vasos_hidratacion: vasosHidratacion,
      vomitos_persistentes: Boolean(metricas.vomitosPersistentes),
      escalofrios_temblor: Boolean(metricas.escalofriosTemblor),
      confusion_o_deterioro: Boolean(metricas.confusionODeterioro),
      sangre_orina: Boolean(metricas.sangreOrina),
      tomo_tratamiento: metricas.tomoTratamiento !== false,
      glucosa_capilar: metricas.glucosaCapilar ? Number(metricas.glucosaCapilar) : null,
      nivel_semaforo_resultante: evalRes.nivelSemaforo,
      comentario_clinico: metricas.comentario || evalRes.tituloSemaforo,
    });
    if (errCheck) throw new Error(errCheck.message);

    // 2. Actualizar estado actual del seguimiento
    const { data: actualizado, error: errUpd } = await supabase
      .from('seguimientos_activos')
      .update({
        nivel_semaforo: evalRes.nivelSemaforo,
        titulo_semaforo: evalRes.tituloSemaforo,
        mensaje_protocolo: evalRes.mensajeProtocolo,
        triggers_activos: evalRes.triggersActivos,
        alerta_metabolica: evalRes.alertaMetabolica,
        mensaje_metabolico: evalRes.mensajeMetabolico,
        alerta_reevaluacion_imagen: evalRes.alertaReevaluacionImagen,
        mensaje_reevaluacion_imagen: evalRes.mensajeReevaluacionImagen,
        temperatura_actual: metricas.temperatura !== '' && metricas.temperatura !== undefined ? Number(metricas.temperatura) : null,
        dolor_lumbar_actual: metricas.dolorLumbar !== '' && metricas.dolorLumbar !== undefined ? Number(metricas.dolorLumbar) : null,
        escalofrios_temblor: Boolean(metricas.escalofriosTemblor),
        vomitos_persistentes: Boolean(metricas.vomitosPersistentes),
        tolera_liquidos_medicamentos: metricas.toleraLiquidosMedicamentos !== false,
        sintomas_urinarios_activos: Boolean(metricas.sintomasUrinarios),
        sangre_orina: Boolean(metricas.sangreOrina),
        confusion_o_deterioro: Boolean(metricas.confusionODeterioro),
        glucosa_capilar_actual: metricas.glucosaCapilar ? Number(metricas.glucosaCapilar) : null,
        ml_hidratacion: mlHidratacion,
        vasos_hidratacion: vasosHidratacion,
        dosis_omitidas: metricas.tomoTratamiento === false ? (seg.dosis_omitidas || 0) + 1 : seg.dosis_omitidas || 0,
        ultimo_checkin_at: new Date().toISOString(),
      })
      .eq('id', seg.id)
      .select('*, paciente:usuarios!seguimientos_activos_paciente_id_fkey(*)')
      .single();

    if (errUpd) throw new Error(errUpd.message);
    return { ...actualizado, paciente: mapUsuario(actualizado.paciente) };
  },

  async actualizarSeguimiento(seguimientoId, campos) {
    const { data, error } = await supabase
      .from('seguimientos_activos')
      .update(campos)
      .eq('id', seguimientoId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // ==========================================
  // 4. ATENCIONES CLÍNICAS
  // ==========================================
  async getAtencionesPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('atenciones')
      .select('*, profesional:usuarios!atenciones_profesional_id_fkey(*)')
      .eq('paciente_id', pacienteId)
      .order('fecha_hora', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getTodasAtenciones() {
    const { data, error } = await supabase
      .from('atenciones')
      .select('*, paciente:usuarios!atenciones_paciente_id_fkey(*), profesional:usuarios!atenciones_profesional_id_fkey(*)')
      .order('fecha_hora', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getAtencionById(id) {
    const { data, error } = await supabase
      .from('atenciones')
      .select('*, paciente:usuarios!atenciones_paciente_id_fkey(*), profesional:usuarios!atenciones_profesional_id_fkey(*)')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async crearAtencion(payload) {
    const codigo = String(Math.floor(100000 + Math.random() * 900000)).padStart(7, '0');
    const { data, error } = await supabase
      .from('atenciones')
      .insert({ codigo_atencion: codigo, ...payload })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async actualizarEstadoAtencion(id, estado) {
    const { data, error } = await supabase
      .from('atenciones')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // ==========================================
  // 5. EXÁMENES DE LABORATORIO + SUPABASE STORAGE
  // ==========================================
  async getExamenesPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('examenes_laboratorio')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('fecha_subida', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getExamenesPendientes() {
    const { data, error } = await supabase
      .from('examenes_laboratorio')
      .select('*, paciente:usuarios!examenes_laboratorio_paciente_id_fkey(*)')
      .in('estado', ['Resultado disponible: pendiente de revisión', 'Muestra recolectada/en proceso'])
      .order('fecha_subida', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getExamenById(id) {
    const { data, error } = await supabase
      .from('examenes_laboratorio')
      .select('*, paciente:usuarios!examenes_laboratorio_paciente_id_fkey(*)')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async subirExamen(pacienteId, file, tipoExamen = 'Urocultivo') {
    const nombreSeguro = `${Date.now()}_${sanitizarNombreArchivo(file.name)}`;
    const ruta = `examenes/${pacienteId}/${nombreSeguro}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(ruta, file, { upsert: false, contentType: file.type });

    if (uploadError) throw new Error(`Error subiendo archivo: ${uploadError.message}`);

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(ruta);

    const { data, error } = await supabase
      .from('examenes_laboratorio')
      .insert({
        paciente_id: pacienteId,
        tipo_examen: tipoExamen,
        nombre_archivo: file.name,
        url_archivo: pub.publicUrl,
        fecha_toma: new Date().toISOString().slice(0, 10),
        fecha_resultado: new Date().toISOString().slice(0, 10),
        estado: 'Resultado disponible: pendiente de revisión',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async revisarExamen(examenId, revision) {
    const { data, error } = await supabase
      .from('examenes_laboratorio')
      .update({
        estado: revision.estado || 'Revisado: conducta documentada',
        resultado_cultivo: revision.resultadoCultivo || null,
        microorganismo: revision.microorganismo || null,
        recuento_colonias: revision.recuentoColonias || null,
        resumen_antibiograma: revision.resumenAntibiograma || null,
        conducta_documentada: revision.conductaDocumentada || null,
        profesional_revisor: revision.profesionalRevisor || 'Equipo médico',
        fecha_revision: new Date().toISOString(),
        resistente_a_tratamiento: Boolean(revision.resistenteATratamiento),
      })
      .eq('id', examenId)
      .select('*, paciente:usuarios!examenes_laboratorio_paciente_id_fkey(*)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // ==========================================
  // 6. GUÍAS DE PREVENCIÓN
  // ==========================================
  async getPrevenciones() {
    const { data, error } = await supabase
      .from('prevenciones_guia')
      .select('*')
      .order('fecha', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getPrevencionesActivas() {
    const { data, error } = await supabase
      .from('prevenciones_guia')
      .select('*')
      .eq('estado', 'Activa')
      .order('fecha', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async crearPrevencion(guia) {
    const { data, error } = await supabase
      .from('prevenciones_guia')
      .insert(guia)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async actualizarEstadoPrevencion(id, estado) {
    const { data, error } = await supabase
      .from('prevenciones_guia')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // ==========================================
  // 7. MENSAJES + IMÁGENES EN BUCKET
  // ==========================================
  async getConversacion(usuario1Id, usuario2Id) {
    const { data, error } = await supabase
      .from('mensajes')
      .select('*, remitente:usuarios!mensajes_remitente_id_fkey(id, nombre_completo, rol)')
      .or(
        `and(remitente_id.eq.${usuario1Id},destinatario_id.eq.${usuario2Id}),and(remitente_id.eq.${usuario2Id},destinatario_id.eq.${usuario1Id})`
      )
      .order('fecha_envio', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  async getMensajesUsuario(usuarioId) {
    const { data, error } = await supabase
      .from('mensajes')
      .select('*, remitente:usuarios!mensajes_remitente_id_fkey(id, nombre_completo, rol, especialidad), destinatario:usuarios!mensajes_destinatario_id_fkey(id, nombre_completo, rol, especialidad)')
      .or(`remitente_id.eq.${usuarioId},destinatario_id.eq.${usuarioId}`)
      .order('fecha_envio', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async subirImagenChat(file) {
    const nombreSeguro = `${Date.now()}_${sanitizarNombreArchivo(file.name)}`;
    const ruta = `chat/${nombreSeguro}`;
    const { error } = await supabase.storage.from(BUCKET).upload(ruta, file, { contentType: file.type });
    if (error) throw new Error(`Error subiendo imagen: ${error.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
    return data.publicUrl;
  },

  async enviarMensaje({ remitenteId, destinatarioId, contenido, imagenUrl = null }) {
    const { data, error } = await supabase
      .from('mensajes')
      .insert({
        remitente_id: remitenteId,
        destinatario_id: destinatarioId,
        contenido,
        imagen_url: imagenUrl,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // ==========================================
  // 8. RECORDATORIOS Y TAREAS CLÍNICAS
  // ==========================================
  async getRecordatoriosPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('recordatorios')
      .select('*')
      .eq('paciente_id', pacienteId)
      .eq('activo', true)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getTodosRecordatorios() {
    const { data, error } = await supabase
      .from('recordatorios')
      .select('*, paciente:usuarios!recordatorios_paciente_id_fkey(id, nombre_completo)')
      .eq('activo', true)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async crearRecordatorio(payload) {
    const { data, error } = await supabase
      .from('recordatorios')
      .insert(payload)
      .select('*, paciente:usuarios!recordatorios_paciente_id_fkey(id, nombre_completo)')
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async completarRecordatorio(id) {
    const { data, error } = await supabase
      .from('recordatorios')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};