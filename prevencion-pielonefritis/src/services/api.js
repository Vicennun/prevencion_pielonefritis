const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Autenticación
  registrar: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Evaluaciones de Riesgo y Panel Médico
  crearEvaluacion: (data) => request('/evaluaciones', { method: 'POST', body: JSON.stringify(data) }),
  getEvaluacionesPaciente: (pacienteId) => request(`/evaluaciones/paciente/${pacienteId}`),
  getPanelMedico: () => request('/evaluaciones/panel-medico'),

  // Seguimiento Activo y Semáforo Clínico
  getSeguimientos: () => request('/seguimiento'),
  getSeguimientoPaciente: (pacienteId) => request(`/seguimiento/paciente/${pacienteId}`),
  registrarCheckin: (seguimientoId, metricas) =>
    request(`/seguimiento/${seguimientoId}/checkin`, { method: 'POST', body: JSON.stringify(metricas) }),

  // Exámenes
  getExamenesPaciente: (pacienteId) => request(`/examenes/paciente/${pacienteId}`),
  getExamenesPendientes: () => request('/examenes/pendientes'),
  subirExamen: async (pacienteId, file) => {
    const formData = new FormData();
    formData.append('pacienteId', pacienteId);
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/examenes/subir`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Error al subir archivo');
    return res.json();
  },
  revisarExamen: (examenId, payload) =>
    request(`/examenes/${examenId}/revisar`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Prevenciones, Mensajes y Recordatorios
  getPrevenciones: () => request('/prevenciones'),
  getPrevencionesActivas: () => request('/prevenciones/activas'),
  crearPrevencion: (data) => request('/prevenciones', { method: 'POST', body: JSON.stringify(data) }),
  getConversacion: (u1, u2) => request(`/mensajes/conversacion?usuario1Id=${u1}&usuario2Id=${u2}`),
  enviarMensaje: (data) => request('/mensajes', { method: 'POST', body: JSON.stringify(data) }),
  getRecordatoriosPaciente: (pacienteId) => request(`/recordatorios/paciente/${pacienteId}`),
};