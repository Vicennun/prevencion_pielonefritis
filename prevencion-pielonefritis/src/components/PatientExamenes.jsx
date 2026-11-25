import React, { useEffect, useRef, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { api, getStoredUser } from '../services/api';

const TIPOS_EXAMEN = [
  'Urocultivo y antibiograma',
  'Examen de orina completo (EGO)',
  'Urocultivo de control',
  'Estudio de imagen (Ecografía / TAC)',
  'Creatinina / Función renal',
];

export default function PatientExamenes() {
  const fileInputRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [tipoExamen, setTipoExamen] = useState(TIPOS_EXAMEN[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarExamenes = async () => {
    try {
      const pacienteId = getStoredUser()?.id || 3;
      const lista = await api.getExamenesPaciente(pacienteId);
      setExamenes(lista || []);
    } catch (err) {
      console.error('Error cargando exámenes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarExamenes();
  }, []);

  const validarYSeleccionar = (file) => {
    setError('');
    setSuccessMsg('');
    if (!file) return;

    const permitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!permitidos.includes(file.type)) {
      setError('Formato no soportado. Sube un archivo PDF, JPG o PNG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo supera el límite máximo de 10 MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validarYSeleccionar(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validarYSeleccionar(file);
  };

  const handleSubir = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const pacienteId = getStoredUser()?.id || 3;
      await api.subirExamen(pacienteId, selectedFile, tipoExamen);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccessMsg('Examen subido correctamente. Quedó disponible para revisión de tu equipo médico.');
      await cargarExamenes();
    } catch (err) {
      setError(err.message || 'No se pudo subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getEstadoStyle = (estado) => {
    if (!estado) return 'bg-slate-200 text-slate-700';
    if (estado.startsWith('Revisado')) return 'bg-green-100 text-green-700';
    if (estado.startsWith('Resultado disponible')) return 'bg-amber-100 text-amber-800';
    if (estado.startsWith('Muestra rechazada')) return 'bg-red-100 text-red-700';
    return 'bg-slate-200 text-slate-700';
  };

  return (
    <main className="flex-1 bg-neutral-100 min-h-screen p-4 lg:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-bold font-['Inter']">Mis Exámenes</h1>
          <p className="text-slate-500 text-sm font-normal font-['Inter']">
            Sube tus resultados de urocultivo, antibiograma o exámenes de orina para que tu equipo médico documente la conducta.
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3.5 py-2.5 bg-white rounded-full border border-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 bg-red-700 rounded-sm animate-pulse" />
            <span className="text-slate-900 text-xs font-medium font-['Inter']">Notificaciones</span>
          </button>
          <NotificationsMenu isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Zona de Subida Real */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-slate-900 text-base font-bold font-['Inter']">Subir nuevo documento</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Selecciona el tipo de examen y adjunta el informe original de laboratorio (PDF, JPG o PNG, máximo 10 MB).
              </p>
            </div>

            {/* Selector tipo examen */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-800 text-xs font-semibold">Tipo de examen</label>
              <select
                value={tipoExamen}
                onChange={(e) => setTipoExamen(e.target.value)}
                className="w-full sm:w-80 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
              >
                {TIPOS_EXAMEN.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`w-full h-56 rounded-xl border-2 border-dashed flex flex-col justify-center items-center gap-3 transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex justify-center items-center text-teal-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center px-4">
                  <p className="text-slate-900 text-sm font-semibold font-['Inter']">
                    Haz clic para buscar o arrastra tu archivo aquí
                  </p>
                  <p className="text-slate-500 text-xs font-normal font-['Inter'] mt-1">
                    Soporta PDF, JPG o PNG (Máx. 10 MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 bg-teal-50 border border-teal-200 rounded-xl flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-teal-700 text-white rounded-lg flex justify-center items-center shrink-0 text-sm font-bold">
                    DOC
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-teal-900 text-sm font-semibold truncate">{selectedFile.name}</span>
                    <span className="text-teal-700 text-xs">
                      {formatBytes(selectedFile.size)} · Listo para enviar ({tipoExamen})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-teal-800 text-xs font-semibold hover:underline shrink-0 cursor-pointer"
                >
                  Quitar
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-medium">
                {successMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubir}
              disabled={!selectedFile || uploading}
              className={`w-full py-3 rounded-xl text-sm font-bold font-['Inter'] transition-colors ${
                selectedFile && !uploading
                  ? 'bg-teal-700 text-white hover:bg-teal-800 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Subiendo archivo al servidor...' : 'Enviar al equipo médico'}
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Importante sobre tus resultados:</strong> Tu profesional debe interpretar el urocultivo y antibiograma junto con tus síntomas. No suspendas ni cambies tu antibiótico por cuenta propia al recibir el informe.
          </div>
        </div>

        {/* Historial Real de Exámenes */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-slate-900 text-base font-bold font-['Inter']">Historial de exámenes</h2>
            <span className="text-slate-400 text-xs">{examenes.length} total</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500">Cargando historial...</p>
          ) : examenes.length === 0 ? (
            <p className="text-xs text-slate-500">Aún no has subido exámenes de laboratorio.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {examenes.map((ex) => (
                <div key={ex.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-slate-900 text-sm font-semibold truncate" title={ex.nombre_archivo || ex.tipo_examen}>
                        {ex.nombre_archivo || ex.tipo_examen}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {ex.tipo_examen} · {new Date(ex.fecha_subida).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>

                  <span className={`self-start px-2 py-0.5 rounded text-[10px] font-bold ${getEstadoStyle(ex.estado)}`}>
                    {ex.estado}
                  </span>

                  {ex.conducta_documentada && (
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-900">
                        Conducta ({ex.profesional_revisor || 'Equipo médico'}):
                      </span>
                      <span>{ex.conducta_documentada}</span>
                      {ex.microorganismo && (
                        <span className="text-slate-500">
                          Microorganismo: {ex.microorganismo} {ex.recuento_colonias ? `(${ex.recuento_colonias})` : ''}
                        </span>
                      )}
                    </div>
                  )}

                  {ex.url_archivo && (
                    <a
                      href={ex.url_archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline text-xs font-semibold self-start"
                    >
                      Ver documento adjunto ›
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}