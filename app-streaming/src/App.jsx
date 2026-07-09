import { useState, useRef, useEffect } from 'react'
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar'
import { useNavigate } from 'react-router-dom'
import { CanvasCompositor } from './components/CanvasCompositor'

// --- DATOS Y ESTILOS ---
const scenes = [
  { id: 'scene-open', name: 'Previa', source: 'Camara 3 + marcador + sponsor' },
  { id: 'scene-live', name: 'Partido', source: 'Camara 1 limpia + scoreboard' },
  { id: 'scene-replay', name: 'Repeticion', source: 'Camara 2 + lower third' },
  { id: 'scene-close', name: 'Cierre', source: 'Camara 4 + logo liga' },
]

const tallyStyles = {
  program: 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-400/30',
  preview: 'bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-300/30',
  idle: 'bg-white/5 text-white ring-1 ring-inset ring-white/10',
}

// --- ICONOS ---
function SidebarIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> }
function CloseIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> }
function BroadcastIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg> }

function TallyBadge({ tally }) {
  const labels = { program: 'Program', preview: 'Preview', idle: 'Libre' }
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${tallyStyles[tally] ?? tallyStyles.idle}`}>
      {labels[tally] ?? 'Libre'}
    </span>
  )
}

// --- COMPONENTE DE VIDEO PARA STREAMS ---
function VideoPlayer({ stream, className }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline muted className={className} />;
}

function App({ onLogout, cameraFeeds = [] }) {
  const [sidebarAbierta, setSidebarAbierta] = useState(false)

  // Referencias para composición y grabación
  const compositorRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // CORRECCIÓN DE LA TRANSMISIÓN: Ahora sí cambia el estado correctamente
  const [isStreaming, setIsStreaming] = useState(false)
  const toggleTransmission = () => {
    if (isStreaming) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsStreaming(false);
      setStreamTime(0);
      setStreamName('');
    } else {
      setShowStartModal(true);
    }
  }

  // --- NUEVOS ESTADOS PARA MODAL Y CRONOLOGÍA ---
  const [showStartModal, setShowStartModal] = useState(false);
  const [tempStreamName, setTempStreamName] = useState('');
  const [streamName, setStreamName] = useState('');
  const [streamTime, setStreamTime] = useState(0);

  // --- ESTADOS DEL MARCADOR (OVERLAYS) ---
  const [scoreLocal, setScoreLocal] = useState(0);
  const [scoreVisitante, setScoreVisitante] = useState(0);
  const [yellowCardsLocal, setYellowCardsLocal] = useState(0);
  const [redCardsLocal, setRedCardsLocal] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamTime(prev => prev + 1);
      }, 1000);
    } else if (!isStreaming && streamTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStreaming, streamTime]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartStream = () => {
    setStreamName(tempStreamName.trim() || 'Transmisión sin título');
    setTempStreamName('');
    setShowStartModal(false);
    setStreamTime(0);
    setIsStreaming(true);

    if (compositorRef.current) {
      try {
        const stream = compositorRef.current.captureStream(30);
        
        // Comprobar mimeTypes soportados
        let options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm;codecs=vp8' };
        }
        
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (window.confirm("La transmisión ha finalizado. ¿Deseas guardar el archivo de video (Grabación)?")) {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `Grabacion_${new Date().toISOString().replace(/:/g, '-')}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
          }
        };

        mediaRecorder.start();
      } catch (e) {
        console.error('Error al iniciar MediaRecorder', e);
      }
    }
  };

  // --- CAPTURA DE CÁMARAS WEBRTC ---
  const [streams, setStreams] = useState({});
  const [hasCameras, setHasCameras] = useState(false);

  useEffect(() => {
    const initCameras = async () => {
      try {
        // Pedir permisos mínimos para asegurar acceso a dispositivos
        await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => {});

        const newStreams = {};
        let anyCameraActive = false;

        for (let i = 0; i < cameraFeeds.length; i++) {
          const feed = cameraFeeds[i];
          if (feed.deviceId) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: feed.deviceId }, width: { ideal: 1280 } }
              });
              newStreams[feed.id] = stream;
              anyCameraActive = true;
            } catch (e) {
              console.warn(`No se pudo iniciar la cámara ${feed.label} con ID ${feed.deviceId}`, e);
            }
          }
        }

        setStreams(newStreams);
        setHasCameras(anyCameraActive);
      } catch (err) {
        console.error("Error crítico accediendo a las cámaras", err);
      }
    };
    initCameras();

    // Limpieza de streams al desmontar
    return () => {
      Object.values(streams).forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, []);

  // --- CONTROL DE VISTAS ---
  const [vistaActual, setVistaActual] = useState('live')

  // --- LÓGICA DEL SWITCHER ---
  const [programId, setProgramId] = useState('cam-1')

  const programCam = cameraFeeds.find(c => c.id === programId)

  /* --- NAVEGACIÓN ENTRE ROUTER --- */
  const navigate = useNavigate()
  const irAddCam = () => {
    navigate('/addCam')
  }

  const irAVista = (vista) => {
    setVistaActual(vista)
    setSidebarAbierta(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_32%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_28%),linear-gradient(180deg,#1a0000,#080000_35%,#000000_100%)] text-white">

      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />

      <div className="mx-auto flex min-h-screen w-full flex-col gap-4 p-4 xl:p-6 max-h-screen overflow-hidden">

        <header className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarAbierta(true)} className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"><SidebarIcon /></button>
            <div className="max-w-3xl">
              <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
                {vistaActual === 'live' ? 'Liga amateur broadcast suite' : vistaActual === 'perfil' ? 'Gestión de cuenta' : 'Centro de Ayuda'}
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
                {vistaActual === 'live' ? 'Control Room' : vistaActual === 'perfil' ? 'Perfil de Usuario' : 'Soporte Técnico'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogout} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/8 transition">Cerrar sesión</button>
          </div>
        </header>

        {vistaActual === 'live' && (
          <main className="flex-1 flex flex-col xl:flex-row gap-4 relative z-10 w-full max-w-[1800px] mx-auto min-h-0 pb-4">
            {/* LEFT SIDE: MAIN PROGRAM & CAMS */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              
              {/* PROGRAM */}
              <section className="flex-1 rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-3 shadow-lg backdrop-blur flex flex-col min-h-[300px]">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Program</h2>
                  <TallyBadge tally={isStreaming ? 'program' : 'idle'} />
                </div>
                <div className={`relative flex-1 w-full overflow-hidden rounded-lg border transition-all duration-500 ${isStreaming ? 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-white/5 bg-black'}`}>
                  {hasCameras ? (
                    <CanvasCompositor 
                      stream={streams[programId]} 
                      compositorRef={compositorRef}
                      scoreLocal={scoreLocal}
                      scoreVisitante={scoreVisitante}
                      yellowCards={yellowCardsLocal}
                      redCards={redCardsLocal}
                      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${isStreaming ? 'opacity-100' : 'opacity-40'}`} 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Esperando señal...</span>
                    </div>
                  )}

                  {!isStreaming && (
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(58,12,12,0.8),rgba(20,5,5,0.95)),radial-gradient(circle_at_top,rgba(176,54,54,0.4),transparent_50%)] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-white/80 font-bold">Offline</p>
                      </div>
                    </div>
                  )}

                  {isStreaming && (
                    <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                      <div className="flex justify-between items-start">
                        <span className="bg-red-600 px-2.5 py-1 rounded text-[9px] font-black animate-pulse">LIVE</span>
                        <div className="bg-black/80 backdrop-blur px-2.5 py-1 rounded-md border border-white/10">
                          <p className="text-[9px] uppercase text-white font-bold">{programCam?.label}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* MINI-PANTALLAS DE CÁMARAS */}
              <section className="shrink-0 rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-2 backdrop-blur">
                <div className="grid grid-cols-4 gap-2">
                  {cameraFeeds.map(cam => {
                    const isProgram = programId === cam.id;
                    return (
                      <button
                        key={cam.id}
                        onClick={() => setProgramId(cam.id)}
                        className={`group relative aspect-video rounded-lg overflow-hidden border transition-all ${isProgram ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/10 hover:border-white/30'} bg-black flex items-center justify-center`}
                      >
                        {hasCameras && streams[cam.id] ? (
                          <VideoPlayer stream={streams[cam.id]} className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <span className="text-[8px] uppercase font-bold text-white/30">Offline</span>
                        )}

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.8))] pointer-events-none" />
                        
                        <div className="absolute bottom-1.5 left-2 pointer-events-none">
                           <span className={`text-[9px] font-bold uppercase tracking-wider ${isProgram ? 'text-red-400' : 'text-white'}`}>{cam.label}</span>
                        </div>

                        {isProgram && <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_red] z-10" />}
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* RIGHT SIDE: PANELS (Scenes, Timeline, Controls) */}
            <div className="w-full xl:w-[340px] flex flex-col gap-4 shrink-0 overflow-y-auto">
              
              {/* CONTROLES */}
              <section className="rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-4 backdrop-blur shrink-0">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={toggleTransmission}
                    className={`w-full rounded-lg py-3 text-xs font-bold uppercase tracking-widest transition-all ${isStreaming ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] text-white hover:bg-red-500' : 'bg-white/10 border border-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isStreaming ? 'Detener Emisión' : 'Iniciar Transmisión'}
                  </button>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => window.electronAPI?.abrirVentanaAjustes()} className="flex-1 rounded-lg border border-white/5 bg-white/[0.03] py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white/10 flex items-center justify-center gap-1.5">
                      ⚙️ Ajustes
                    </button>
                    <button type="button" onClick={irAddCam} className="flex-1 rounded-lg border border-white/5 bg-white/[0.03] py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white/10">
                      + Cámara
                    </button>
                  </div>
                </div>
              </section>

              {/* Producción / Escenas */}
              <section className="flex-1 rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-4 backdrop-blur flex flex-col min-h-[150px]">
                <h3 className="mb-2 text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold">Escenas</h3>
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {scenes.map((s, i) => (
                    <button key={s.id} className="w-full flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-2 text-left hover:bg-white/[0.08] transition">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/5 text-[9px] font-bold text-white/70">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{s.name}</p>
                        <p className="text-[8px] text-white/40 uppercase truncate">{s.source}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Timeline & Eventos */}
              <section className="shrink-0 rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-4 backdrop-blur">
                <h3 className="mb-2 text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold">Marcador y Eventos</h3>
                <div className="space-y-2.5">
                  <div className={`rounded-lg border p-2.5 flex justify-between items-center transition-colors ${isStreaming ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5'}`}>
                    <span className={`text-[9px] font-bold uppercase ${isStreaming ? 'text-red-400' : 'text-white/40'}`}>
                      {isStreaming ? 'En progreso' : 'Fuera de línea'}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {isStreaming ? formatTime(streamTime) : '00:00'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={() => setScoreLocal(prev => prev + 1)} className="rounded-lg bg-white/5 p-2 text-[9px] font-bold uppercase border border-white/5 text-white hover:bg-white/10 transition" disabled={!isStreaming}>
                      + Gol Loc ({scoreLocal})
                    </button>
                    <button onClick={() => setScoreVisitante(prev => prev + 1)} className="rounded-lg bg-white/5 p-2 text-[9px] font-bold uppercase border border-white/5 text-white hover:bg-white/10 transition" disabled={!isStreaming}>
                      + Gol Vis ({scoreVisitante})
                    </button>
                    <button onClick={() => setYellowCardsLocal(prev => prev + 1)} className="rounded-lg bg-white/5 p-2 text-[9px] font-bold uppercase border border-white/5 text-yellow-500 hover:bg-white/10 transition" disabled={!isStreaming}>
                      T. Amarilla
                    </button>
                    <button onClick={() => setRedCardsLocal(prev => prev + 1)} className="rounded-lg bg-white/5 p-2 text-[9px] font-bold uppercase border border-white/5 text-red-500 hover:bg-white/10 transition" disabled={!isStreaming}>
                      T. Roja
                    </button>
                  </div>

                  <button onClick={() => {
                      if (window.confirm('¿Reiniciar marcadores?')) {
                        setScoreLocal(0); setScoreVisitante(0); setYellowCardsLocal(0); setRedCardsLocal(0);
                      }
                    }}
                    className="w-full mt-1 rounded-lg border border-white/5 bg-transparent py-1.5 text-[9px] font-bold uppercase text-white/30 hover:bg-white/5 hover:text-white transition"
                  >
                    Reiniciar
                  </button>
                </div>
              </section>

            </div>
          </main>
        )}
        
        {vistaActual === 'perfil' && (
          /* PERFIL DE USUARIO */
          <main className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-fadeIn">
            <section className="rounded-[28px] border border-white/10 bg-black/75 p-8 backdrop-blur flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <div className="relative mb-6">
                <div className="h-32 w-32 rounded-full border-4 border-white/10 bg-[linear-gradient(160deg,rgba(58,12,12,0.82),rgba(20,5,5,0.96))] flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-black text-white">OP</span>
                </div>
                <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-black shadow-sm"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Operador Principal</h2>
              <p className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Administrador Suite</p>
              <div className="w-full space-y-3">
                <button className="w-full rounded-2xl bg-neutral-900 border border-white/20 text-white py-3.5 text-sm font-bold hover:bg-neutral-800 transition">Editar Perfil</button>
                <button onClick={onLogout} className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold hover:bg-white/10 text-red-400 transition">Cerrar Sesión</button>
              </div>
            </section>

            <div className="md:col-span-2 flex flex-col gap-6">
              <section className="rounded-[28px] border border-white/10 bg-black/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <h3 className="mb-6 text-[11px] uppercase tracking-[0.22em] text-white font-bold border-b border-white/10 pb-4">Detalles de la Cuenta</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-white mb-2">Correo Electrónico</label>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">operador@ligaamateur.com</div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-white mb-2">Puesto de Control</label>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Mesa Técnica Principal</div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-white mb-2">Clave de Transmisión (RTMP Stream Key)</label>
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white font-mono tracking-widest flex items-center">••••••••••••••••••••••••••••</div>
                      <button className="rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-xs font-bold text-white hover:bg-white/20 transition">Copiar</button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-black/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <h3 className="mb-6 text-[11px] uppercase tracking-[0.22em] text-white font-bold border-b border-white/10 pb-4">Rendimiento Técnico Histórico</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-white mb-1">42</span>
                    <span className="text-[10px] uppercase tracking-widest text-white">Transmisiones</span>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-white mb-1">128h</span>
                    <span className="text-[10px] uppercase tracking-widest text-white">Tiempo de Aire</span>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-emerald-400 mb-1">99.8%</span>
                    <span className="text-[10px] uppercase tracking-widest text-white">Uptime</span>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-white mb-1">0</span>
                    <span className="text-[10px] uppercase tracking-widest text-white">Fallas Críticas</span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        )}

        {vistaActual === 'soporte' && (
          /* AYUDA Y SOPORTE */
          <main className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-fadeIn max-w-6xl mx-auto w-full">
            <div className="md:col-span-2 flex flex-col gap-6">
              <section className="rounded-[28px] border border-white/10 bg-black/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <h2 className="text-2xl font-bold text-white mb-6">Guía Rápida de Uso</h2>
                
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">1. Configurar Cámaras</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Conecta tus dispositivos de video antes de iniciar. Utiliza el botón <strong className="text-white">+ Cámara</strong> en el Control Room para asignar las fuentes de video a los diferentes roles (Master, Arco, Banca). 
                      Selecciona una cámara en las mini-pantallas para enviarla al <strong className="text-white">Program</strong> (pantalla principal).
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">2. Transmisión</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Presiona <strong className="text-white">Iniciar Transmisión</strong> para comenzar a emitir. Durante la transmisión, puedes cambiar de cámara en vivo y utilizar el panel de eventos para actualizar el marcador y tarjetas. Al finalizar, la app te permitirá descargar la grabación de manera local.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">3. Ajustes de Emisión</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      El botón de <strong className="text-white">⚙️ Ajustes</strong> te permite configurar tu clave RTMP, resolución, bitrate y otros parámetros del sistema. Es recomendable hacer esto antes de salir al aire.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-[28px] border border-white/10 bg-black/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)] flex flex-col">
              <h3 className="mb-6 text-[11px] uppercase tracking-[0.22em] text-white font-bold border-b border-white/10 pb-4">Contacto de Soporte</h3>
              <p className="text-sm text-white/60 mb-8">
                Si experimentas fallas críticas durante una emisión o necesitas asistencia técnica urgente, contacta al equipo de soporte de Nivel 2.
              </p>

              <div className="space-y-6 mt-auto">
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                  <span className="block text-xl font-black text-white mb-1">0800-555-LIGA</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Teléfono (24/7)</span>
                </div>
                
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                  <span className="block text-sm font-bold text-emerald-400 mb-1">soporte@ligaamateur.com</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Correo Electrónico</span>
                </div>
              </div>
            </section>
          </main>
        )}

        {/* START MODAL */}
        {showStartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowStartModal(false)} />
            <div className="relative z-10 w-full max-w-sm rounded-[24px] border border-white/10 bg-neutral-900 p-6 shadow-2xl animate-fadeIn">
              <h3 className="mb-2 text-xl font-bold text-white">Iniciar Transmisión</h3>
              <p className="mb-4 text-xs text-white/70">Asigna un nombre a este evento para la cronología.</p>

              <input
                type="text"
                autoFocus
                placeholder="Ej: Final Torneo Regional"
                value={tempStreamName}
                onChange={(e) => setTempStreamName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartStream()}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="flex-1 rounded-xl bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStartStream}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-500 transition shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR OVERLAY */}
        {sidebarAbierta && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-[300px] border-r border-white/10 bg-black p-8 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold tracking-tighter">MENÚ</h2>
                <button onClick={() => setSidebarAbierta(false)} className="p-2 bg-white/5 rounded-lg"><CloseIcon /></button>
              </div>
              <nav className="space-y-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white">Navegación</div>

                <div
                  onClick={() => irAVista('live')}
                  className={`flex items-center gap-4 font-bold cursor-pointer transition ${vistaActual === 'live' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {vistaActual === 'live' && <div className="h-2 w-2 rounded-full bg-slate-300" />}
                  Control Live
                </div>

                <div
                  onClick={() => irAVista('perfil')}
                  className={`flex items-center gap-4 font-bold cursor-pointer transition ${vistaActual === 'perfil' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {vistaActual === 'perfil' && <div className="h-2 w-2 rounded-full bg-slate-300" />}
                  Configuración Perfil
                </div>

                <div
                  onClick={() => irAVista('soporte')}
                  className={`flex items-center gap-4 font-bold cursor-pointer transition ${vistaActual === 'soporte' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {vistaActual === 'soporte' && <div className="h-2 w-2 rounded-full bg-slate-300" />}
                  Ayuda y Soporte
                </div>
              </nav>
            </div>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarAbierta(false)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
