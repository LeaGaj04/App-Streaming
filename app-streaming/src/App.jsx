import { useState, useRef } from 'react'
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar'
import { useNavigate } from 'react-router-dom'

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
  idle: 'bg-sky-400/15 text-sky-200 ring-1 ring-inset ring-sky-300/30',
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

function App({ onLogout }) {
  const [sidebarAbierta, setSidebarAbierta] = useState(false)
  
  // CORRECCIÓN DE LA TRANSMISIÓN: Ahora sí cambia el estado correctamente
  const [isStreaming, setIsStreaming] = useState(false)
  const toggleTransmission = () => {
    setIsStreaming(!isStreaming)
  }
  
  const videoRef = useRef(null)

  // --- CONTROL DE VISTAS ---
  const [vistaActual, setVistaActual] = useState('live')

  // --- LÓGICA DEL SWITCHER ---
  const [previewId, setPreviewId] = useState('cam-2')
  const [programId, setProgramId] = useState('cam-1')

  const previewCam = cameraFeeds.find(c => c.id === previewId)
  const programCam = cameraFeeds.find(c => c.id === programId)

  const handleCut = () => {
    const temp = programId
    setProgramId(previewId)
    setPreviewId(temp)
  }

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(48,124,199,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,137,61,0.16),transparent_28%),linear-gradient(180deg,#10263d,#07111c_35%,#050a12_100%)] text-slate-200">
      
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />

      <div className="mx-auto flex min-h-screen w-full flex-col gap-6 p-4 sm:p-8 xl:p-10">
        
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between relative z-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {vistaActual === 'live' ? 'Liga amateur broadcast suite' : 'Gestión de cuenta'}
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-50 sm:text-5xl xl:text-6xl">
              {vistaActual === 'live' ? 'Control Room' : 'Perfil de Usuario'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarAbierta(true)} className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"><SidebarIcon /></button>
             <button onClick={onLogout} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/8 transition">Cerrar sesión</button>
          </div>
        </header>
      
        {vistaActual === 'live' ? (
          <main className="grid gap-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* PREVIEW */}
              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">Siguiente corte</p>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">Preview</h2>
                  </div>
                  <TallyBadge tally="preview" />
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(53,48,22,0.82),rgba(10,10,10,0.95)),radial-gradient(circle_at_top,rgba(255,197,92,0.4),transparent_55%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-35 mix-blend-screen" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <BroadcastIcon />
                  </div>
                  <div className="absolute left-6 top-6">
                    <span className="rounded-full bg-slate-950/80 px-3 py-1 text-[10px] uppercase font-bold text-amber-200 border border-amber-500/20">
                      {previewCam?.label} - {previewCam?.role}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={handleCut} className="rounded-2xl border border-white/10 bg-white/5 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition">Corte Directo</button>
                  <button className="rounded-2xl border border-white/10 bg-white/5 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition">Auto Trans</button>
                </div>
                <button type="button" onClick={irAddCam} className="w-full rounded-2xl bg-linear-to-br from-orange-400 to-red-500 mt-4 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                  Agregar Cámara
                </button>
              </section>

              {/* PROGRAM */}
              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">Salida actual</p>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">Program</h2>
                  </div>
                  <TallyBadge tally={isStreaming ? 'program' : 'idle'} />
                </div>
                <div className={`relative aspect-video w-full overflow-hidden rounded-[24px] border transition-all duration-500 ${isStreaming ? 'border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'border-white/10 bg-black'}`}>
                  
                  <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isStreaming ? 'opacity-100' : 'opacity-0'}`} />

                  {!isStreaming && (
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(12,35,58,0.82),rgba(5,10,20,0.96)),radial-gradient(circle_at_top,rgba(54,115,176,0.55),transparent_50%)] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Offline</p>
                      </div>
                    </div>
                  )}

                  {isStreaming && (
                    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                      <div className="flex justify-between items-start">
                        <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-black animate-pulse">LIVE</span>
                        <div className="bg-slate-950/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                          <p className="text-[10px] uppercase text-blue-400 font-bold">{programCam?.label} - {programCam?.role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleTransmission}
                  className={`mt-4 w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-widest transition-all ${isStreaming ? 'bg-linear-to-br from-orange-400 to-red-500 shadow-lg shadow-red-500/20' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                >
                  {isStreaming ? 'Detener Emisión' : 'Iniciar Transmisión'}
                </button>
              </section>
            </div>

            {/* PANEL INFERIOR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 backdrop-blur">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">Producción / Escenas</h3>
                <div className="grid gap-2">
                  {scenes.map((s, i) => (
                    <button key={s.id} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-left hover:bg-white/[0.08] transition">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[10px] font-bold text-blue-400">{i+1}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{s.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{s.source}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 backdrop-blur">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">Fuentes de Video</h3>
                <div className="grid gap-3">
                  {cameraFeeds.map(cam => {
                    const isProgram = programId === cam.id;
                    const isPreview = previewId === cam.id;
                    const currentTally = isProgram ? 'program' : (isPreview ? 'preview' : 'idle');

                    return (
                      <button 
                        key={cam.id} 
                        onClick={() => setPreviewId(cam.id)}
                        className="w-full group flex items-center justify-between rounded-2xl bg-white/[0.03] p-3 border border-white/5 hover:bg-white/[0.08] transition text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${isProgram ? 'bg-red-500 shadow-[0_0_10px_red]' : (isPreview ? 'bg-amber-400' : 'bg-slate-600')}`} />
                          <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{cam.label}</span>
                        </div>
                        <TallyBadge tally={currentTally} />
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 backdrop-blur">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">Timeline & Eventos</h3>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">
                    <p className="text-xs font-bold text-blue-400 uppercase">En progreso</p>
                    <p className="text-sm text-slate-200 mt-1">Segundo tiempo - 68:14</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase hover:bg-white/10 border border-white/5">Gol Local</button>
                    <button className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase hover:bg-white/10 border border-white/5">Tarjeta</button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        ) : (
          /* PERFIL DE USUARIO */
          <main className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-fadeIn">
            <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-8 backdrop-blur flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <div className="relative mb-6">
                <div className="h-32 w-32 rounded-full border-4 border-white/10 bg-[linear-gradient(160deg,rgba(12,35,58,0.82),rgba(5,10,20,0.96))] flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-black text-slate-300">OP</span>
                </div>
                <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-sm"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Operador Principal</h2>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Administrador Suite</p>
              <div className="w-full space-y-3">
                <button className="w-full rounded-2xl bg-white text-slate-900 py-3.5 text-sm font-bold hover:bg-slate-200 transition">Editar Perfil</button>
                <button onClick={onLogout} className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold hover:bg-white/10 text-red-400 transition">Cerrar Sesión</button>
              </div>
            </section>

            <div className="md:col-span-2 flex flex-col gap-6">
              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <h3 className="mb-6 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold border-b border-white/10 pb-4">Detalles de la Cuenta</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-2">Correo Electrónico</label>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">operador@ligaamateur.com</div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-2">Puesto de Control</label>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">Mesa Técnica Principal</div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-2">Clave de Transmisión (RTMP Stream Key)</label>
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-500 font-mono tracking-widest flex items-center">••••••••••••••••••••••••••••</div>
                      <button className="rounded-xl bg-blue-600/20 border border-blue-500/30 px-6 py-3 text-xs font-bold text-blue-400 hover:bg-blue-600/40 transition">Copiar</button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <h3 className="mb-6 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold border-b border-white/10 pb-4">Rendimiento Técnico Histórico</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-white mb-1">42</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Transmisiones</span>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-blue-400 mb-1">128h</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Tiempo de Aire</span>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-emerald-400 mb-1">99.8%</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Uptime</span>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-center">
                    <span className="block text-3xl font-black text-white mb-1">0</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Fallas Críticas</span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        )}

        {/* SIDEBAR OVERLAY */}
        {sidebarAbierta && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-[300px] border-r border-white/10 bg-slate-950 p-8 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-10">
                  <h2 className="text-xl font-bold tracking-tighter">MENÚ</h2>
                  <button onClick={() => setSidebarAbierta(false)} className="p-2 bg-white/5 rounded-lg"><CloseIcon /></button>
              </div>
              <nav className="space-y-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Navegación</div>
                  
                  <div 
                    onClick={() => irAVista('live')}
                    className={`flex items-center gap-4 font-bold cursor-pointer transition ${vistaActual === 'live' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    {vistaActual === 'live' && <div className="h-2 w-2 rounded-full bg-blue-400" />} 
                    Control Live
                  </div>

                  <div 
                    onClick={() => irAVista('perfil')}
                    className={`flex items-center gap-4 font-bold cursor-pointer transition ${vistaActual === 'perfil' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    {vistaActual === 'perfil' && <div className="h-2 w-2 rounded-full bg-blue-400" />} 
                    Configuración Perfil
                  </div>
                  
                  <div className="text-slate-400 hover:text-white cursor-pointer transition">Ajustes del Sistema</div>
                  <div className="text-slate-400 hover:text-white cursor-pointer transition">Gestión de Cámaras</div>
                  
                  <div 
                    onClick={() => {
                      window.electronAPI?.abrirVentanaAjustes();
                      setSidebarAbierta(false); 
                    }} 
                    className="text-slate-400 hover:text-white cursor-pointer transition"
                  >
                    Ajustes de Emisión
                  </div>
              </nav>
            </div>
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSidebarAbierta(false)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App