import { useState, useRef, useEffect } from 'react'
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar'
import { useNavigate } from 'react-router-dom'
import { CanvasCompositor } from './components/CanvasCompositor'

// --- DATOS Y ESTILOS ---
const cameraFeeds = [
  { id: 'cam-1', label: 'Camara 1', role: 'Master lateral', status: 'En linea', note: 'Seguimiento principal del juego' },
  { id: 'cam-2', label: 'Camara 2', role: 'Arco norte', status: 'En linea', note: 'Ideal para tiros libres y area' },
  { id: 'cam-3', label: 'Camara 3', role: 'Banca y staff', status: 'Listo', note: 'Reacciones y cambios' },
  { id: 'cam-4', label: 'Camara 4', role: 'Movil cancha', status: 'Chequeo', note: 'Cercania para entrevistas' },
]

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

function App({ onLogout }) {
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
        // Pedimos permiso inicial
        const initialStream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 } } });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');

        const newStreams = {};
        let defaultStream = initialStream;

        for (let i = 0; i < cameraFeeds.length; i++) {
          const feed = cameraFeeds[i];
          if (videoDevices[i]) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: videoDevices[i].deviceId } }
              });
              newStreams[feed.id] = stream;
              if (i === 0) defaultStream = stream; // Guardar el primero como fallback para los demás si faltan
            } catch (e) {
              newStreams[feed.id] = defaultStream;
            }
          } else {
            // Si el usuario no tiene 4 cámaras físicas, duplicamos la principal para la demo
            newStreams[feed.id] = defaultStream;
          }
        }

        setStreams(newStreams);
        setHasCameras(true);
      } catch (err) {
        console.error("Error accediendo a las cámaras", err);
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

      <div className="mx-auto flex min-h-screen w-full flex-col gap-6 p-4 sm:p-8 xl:p-10">

        <header className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarAbierta(true)} className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"><SidebarIcon /></button>
            <div className="max-w-3xl">
              <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
                {vistaActual === 'live' ? 'Liga amateur broadcast suite' : 'Gestión de cuenta'}
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
                {vistaActual === 'live' ? 'Control Room' : 'Perfil de Usuario'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogout} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/8 transition">Cerrar sesión</button>
          </div>
        </header>

        {vistaActual === 'live' ? (
          <main className="grid gap-6 relative z-10">
            <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto w-full">

              {/* PROGRAM */}
              <section className="rounded-[28px] border border-white/10 bg-black/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.22em] text-white">Salida actual</p>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Program</h2>
                  </div>
                  <TallyBadge tally={isStreaming ? 'program' : 'idle'} />
                </div>
                <div className={`relative aspect-video w-full overflow-hidden rounded-[24px] border transition-all duration-500 ${isStreaming ? 'border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'border-white/10 bg-black'}`}>

                  {hasCameras ? (
                    <CanvasCompositor 
                      stream={streams[programId]} 
                      compositorRef={compositorRef}
                      scoreLocal={scoreLocal}
                      scoreVisitante={scoreVisitante}
                      yellowCards={yellowCardsLocal}
                      redCards={redCardsLocal}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isStreaming ? 'opacity-100' : 'opacity-30 blur-[2px]'}`} 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Esperando señal de cámara...</span>
                    </div>
                  )}

                  {!isStreaming && (
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(58,12,12,0.82),rgba(20,5,5,0.96)),radial-gradient(circle_at_top,rgba(176,54,54,0.55),transparent_50%)] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Offline</p>
                      </div>
                    </div>
                  )}

                  {isStreaming && (
                    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                      <div className="flex justify-between items-start">
                        <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-black animate-pulse">LIVE</span>
                        <div className="bg-black/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                          <p className="text-[10px] uppercase text-white font-bold">{programCam?.label} - {programCam?.role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* MINI-PANTALLAS DE CÁMARAS */}
                <div className="mt-6 grid grid-cols-4 gap-4">
                  {cameraFeeds.map(cam => {
                    const isProgram = programId === cam.id;
                    const isOnline = cam.status === 'En linea' || cam.status === 'Listo';
                    return (
                      <button
                        key={cam.id}
                        onClick={() => setProgramId(cam.id)}
                        className={`group flex flex-col items-center gap-2 rounded-2xl p-2 transition-all ${isProgram ? 'bg-red-500/10 border-red-500/50' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06]'} border`}
                      >
                        <div className={`relative aspect-video w-full rounded-xl overflow-hidden border ${isProgram ? 'border-red-500' : 'border-white/10'} bg-black flex items-center justify-center group-hover:border-white/30 transition-colors`}>

                          {hasCameras && streams[cam.id] ? (
                            <VideoPlayer stream={streams[cam.id]} className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-white/40">Offline</span>
                          )}

                          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6))] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white opacity-80">SELECCIONAR</span>
                          </div>

                          {isProgram && <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_red] z-10" />}
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isProgram ? 'text-red-400' : 'text-white'}`}>{cam.label}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={irAddCam} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10">
                    + Cámara
                  </button>
                  <button type="button" onClick={() => window.electronAPI?.abrirVentanaAjustes()} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    Ajustes
                  </button>
                  <button
                    onClick={toggleTransmission}
                    className={`flex-[2] rounded-2xl py-4 text-sm font-bold uppercase tracking-widest transition-all ${isStreaming ? 'bg-linear-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/20' : 'bg-neutral-900 border border-white/20 text-white hover:bg-neutral-800'}`}
                  >
                    {isStreaming ? 'Detener Emisión' : 'Iniciar Transmisión'}
                  </button>
                </div>
              </section>
            </div>

            {/* PANEL INFERIOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
              <section className="rounded-[28px] border border-white/10 bg-black/75 p-5 backdrop-blur">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white font-bold">Producción / Escenas</h3>
                <div className="grid gap-2">
                  {scenes.map((s, i) => (
                    <button key={s.id} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-left hover:bg-white/[0.08] transition">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[10px] font-bold text-white">{i + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{s.name}</p>
                        <p className="text-[10px] text-white uppercase">{s.source}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>


              <section className="rounded-[28px] border border-white/10 bg-black/75 p-5 backdrop-blur">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white font-bold">Timeline & Eventos</h3>
                <div className="space-y-3">
                  <div className={`rounded-2xl border p-4 transition-colors ${isStreaming ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                    <p className={`text-xs font-bold uppercase ${isStreaming ? 'text-red-400' : 'text-white/50'}`}>
                      {isStreaming ? 'En progreso' : 'Fuera de línea'}
                    </p>
                    <p className="text-sm text-white mt-1">
                      {isStreaming ? `${streamName} - ${formatTime(streamTime)}` : '00:00'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button 
                      onClick={() => setScoreLocal(prev => prev + 1)}
                      className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase hover:bg-white/10 border border-white/5 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition" 
                      disabled={!isStreaming}
                    >
                      Gol Local
                    </button>
                    <button 
                      onClick={() => setScoreVisitante(prev => prev + 1)}
                      className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase hover:bg-white/10 border border-white/5 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition" 
                      disabled={!isStreaming}
                    >
                      Gol Visita
                    </button>
                    <button 
                      onClick={() => setYellowCardsLocal(prev => prev + 1)}
                      className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase hover:bg-white/10 border border-white/5 text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition" 
                      disabled={!isStreaming}
                    >
                      T. Amarilla
                    </button>
                    <button 
                      onClick={() => setRedCardsLocal(prev => prev + 1)}
                      className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase hover:bg-white/10 border border-white/5 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition" 
                      disabled={!isStreaming}
                    >
                      T. Roja
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que deseas reiniciar todos los marcadores y tarjetas a cero?')) {
                          setScoreLocal(0);
                          setScoreVisitante(0);
                          setYellowCardsLocal(0);
                          setRedCardsLocal(0);
                        }
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/50 hover:bg-white/10 hover:text-white transition"
                    >
                      Reiniciar Marcador
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        ) : (
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
