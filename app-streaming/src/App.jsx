import { useState } from 'react'
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar'
import Heroicons from '@heroicons/react'

const cameraFeeds = [
  {
    id: 'cam-1',
    label: 'Camara 1',
    role: 'Master lateral',
    status: 'En linea',
    tally: 'program',
    note: 'Seguimiento principal del juego',
  },
  {
    id: 'cam-2',
    label: 'Camara 2',
    role: 'Arco norte',
    status: 'En linea',
    tally: 'preview',
    note: 'Ideal para tiros libres y area',
  },
  {
    id: 'cam-3',
    label: 'Camara 3',
    role: 'Banca y staff',
    status: 'Listo',
    tally: 'idle',
    note: 'Reacciones y cambios',
  },
  {
    id: 'cam-4',
    label: 'Camara 4',
    role: 'Movil cancha',
    status: 'Chequeo',
    tally: 'idle',
    note: 'Cercania para entrevistas y celebraciones',
  },
]

const scenes = [
  { id: 'scene-open', name: 'Previa', source: 'Camara 3 + marcador + sponsor' },
  { id: 'scene-live', name: 'Partido', source: 'Camara 1 limpia + scoreboard' },
  { id: 'scene-replay', name: 'Repeticion', source: 'Camara 2 + lower third' },
  { id: 'scene-close', name: 'Cierre', source: 'Camara 4 + logo liga' },
]

const quickActions = [
  'Iniciar transmision',
  'Marcar evento',
  'Lanzar replay',
  'Mutear comentaristas',
]

const schedule = [
  { time: '15:00', event: 'Inicio partido', state: 'active' },
  { time: '15:22', event: 'Gol local', state: 'pending' },
  { time: '15:45', event: 'Fin primer tiempo', state: 'pending' },
  { time: '16:02', event: 'Inicio segundo tiempo', state: 'pending' },
]

const tallyStyles = {
  program: 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-400/30',
  preview: 'bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-300/30',
  idle: 'bg-sky-400/15 text-sky-200 ring-1 ring-inset ring-sky-300/30',
}




function IconFrame({ children }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] text-slate-200">
      {children}
    </span>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>

  )
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>

  )
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
    </svg>

  )
}

function EventosIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>

  )
}

function AtajosIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
  </svg>

  )
}

function PanelesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>

  )
}

function BroadcastIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>


  )
}
function AjustesIcon(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  )
}




function TallyBadge({ tally }) {
  const labels = {
    program: 'Program',
    preview: 'Preview',
    idle: 'Libre',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${tallyStyles[tally] ?? tallyStyles.idle}`}
    >
      {labels[tally] ?? 'Libre'}
    </span>
  )
}

function App({ onLogout }) {
  const runtime =
    window.controlRoom?.getRuntimeInfo?.() ?? {
      appName: 'Control Room',
      platform: 'desktop',
      mode: 'prototype',
    }
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const toggleSidebar = () => {
    setSidebarAbierta(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(48,124,199,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,137,61,0.16),transparent_28%),linear-gradient(180deg,#10263d,#07111c_35%,#050a12_100%)] text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:flex-row xl:items-start xl:px-7">
        <button onClick={toggleSidebar} className='px-4 py-4'>
          <div className={`${sidebarAbierta ? "block" : "hidden"}`}>
            <Sidebar>
              <SidebarHeader>
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                    Navegacion
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-50">
                    Control Room
                  </h2>
                </div>

                <SidebarSection>
                  <SidebarItem href="/search">
                    <SearchIcon />
                    <SidebarLabel>Buscar</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/inbox">
                    <ProfileIcon />
                    <SidebarLabel>Perfil</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>

              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/" active>
                    <HomeIcon />
                    <SidebarLabel>Control LIVE</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/events">
                    <EventosIcon />
                    <SidebarLabel>Eventos</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/Atajos">
                    <AtajosIcon />
                    <SidebarLabel>Atajos</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/broadcasts">
                    <BroadcastIcon />
                    <SidebarLabel>Emision</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/Paneles">
                    <PanelesIcon />
                    <SidebarLabel>Paneles</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/settings">
                    <AjustesIcon />
                    <SidebarLabel>Ajustes</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </button>
        <div className="flex min-h-screen w-full flex-col gap-6">
        <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Liga amateur broadcast suite
            </p>
            <h1 className="mb-3 text-4xl font-semibold tracking-[-0.05em] text-slate-50 sm:text-5xl xl:text-6xl">
              {runtime.appName}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Centro de control para retransmitir partidos, vigilar camaras y
              lanzar escenas en vivo con una operacion pensada para futbol
              amateur.
            </p>
          </div>

          <div className="w-full xl:max-w-[430px]">
            <div className="mb-3 flex justify-end">
              <button
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/8"
                type="button"
                onClick={onLogout}
              >
                Cerrar sesion
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_0_6px_rgba(248,113,113,0.14)]" />
                  <div>
                    <strong className="block text-sm font-semibold text-slate-100">
                      Salida RTMP
                    </strong>
                    <p className="text-sm text-slate-400">Lista para conectar</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.14)]" />
                  <div>
                    <strong className="block text-sm font-semibold text-slate-100">
                      4 fuentes
                    </strong>
                    <p className="text-sm text-slate-400">
                      {runtime.platform} - {runtime.mode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-4 xl:grid-cols-[1.45fr_1.45fr_1fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Salida actual
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                  Program
                </h2>
              </div>
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300 ring-1 ring-inset ring-red-400/30">
                Al aire
              </span>
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(12,35,58,0.82),rgba(5,10,20,0.96)),radial-gradient(circle_at_top,rgba(54,115,176,0.55),transparent_50%)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-35 mix-blend-screen" />
              <div className="absolute inset-x-4 top-4 z-10 flex flex-col gap-1.5">
                <span className="w-fit rounded-full bg-slate-950/80 px-3 py-1 text-xs text-sky-50">
                  Partido
                </span>
                <strong className="text-lg font-semibold text-white sm:text-xl">
                  Camara 1 - Master lateral
                </strong>
              </div>
              <div className="absolute inset-x-4 bottom-4 z-10 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs text-sky-50">
                  Deportivo Sur 1
                </span>
                <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs text-sky-50">
                  68:14
                </span>
                <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs text-sky-50">
                  Union Central 0
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Siguiente corte
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                  Preview
                </h2>
              </div>
              <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200 ring-1 ring-inset ring-sky-300/30">
                Preparado
              </span>
            </div>

            <div className="relative min-h-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(53,48,22,0.82),rgba(10,10,10,0.95)),radial-gradient(circle_at_top,rgba(255,197,92,0.4),transparent_55%)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-35 mix-blend-screen" />
              <div className="absolute inset-x-4 top-4 z-10 flex flex-col gap-1.5">
                <span className="w-fit rounded-full bg-slate-950/80 px-3 py-1 text-xs text-amber-50">
                  Repeticion
                </span>
                <strong className="text-lg font-semibold text-white sm:text-xl">
                  Camara 2 - Arco norte
                </strong>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/8">
                Corte
              </button>
              <button className="flex-1 rounded-2xl bg-linear-to-br from-orange-400 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                Fundido 300 ms
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur xl:row-span-2">
            <div className="mb-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Fuentes
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                Camaras
              </h2>
            </div>

            <div className="grid gap-3">
              {cameraFeeds.map((camera) => (
                <article
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-3.5"
                  key={camera.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong className="block text-sm font-semibold text-slate-100">
                        {camera.label}
                      </strong>
                      <p className="text-sm text-slate-400">{camera.role}</p>
                    </div>
                    <TallyBadge tally={camera.tally} />
                  </div>

                  <div className="relative my-3 min-h-[106px] overflow-hidden rounded-2xl border border-white/5 bg-[linear-gradient(145deg,rgba(26,64,92,0.86),rgba(12,18,28,0.95)),radial-gradient(circle_at_top_left,rgba(126,187,255,0.22),transparent_50%)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-35 mix-blend-screen" />
                    <span className="absolute inset-x-3 bottom-3 z-10 text-sm text-slate-100">
                      {camera.note}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-400">{camera.status}</span>
                    <button className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/8">
                      Tomar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="mb-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Produccion
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                Escenas
              </h2>
            </div>

            <div className="grid gap-3">
              {scenes.map((scene, index) => (
                <button
                  className="grid w-full grid-cols-[auto_1fr] items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.05]"
                  key={scene.id}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/6 text-sm font-semibold text-amber-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex flex-col gap-1">
                    <strong className="text-sm font-semibold text-slate-100">
                      {scene.name}
                    </strong>
                    <small className="text-sm text-slate-400">{scene.source}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="mb-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Operador
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                Acciones rapidas
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  className="min-h-[84px] rounded-3xl border border-white/10 bg-linear-to-br from-white/8 to-white/[0.03] px-4 py-4 text-left text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:from-white/10 hover:to-white/[0.05]"
                  key={action}
                >
                  {action}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="mb-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Linea de tiempo
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                Eventos del partido
              </h2>
            </div>

            <div className="grid gap-3">
              {schedule.map((item) => (
                <div
                  className={`grid gap-1 rounded-2xl border bg-white/[0.03] px-4 py-3 ${
                    item.state === 'active'
                      ? 'border-orange-400/50'
                      : 'border-white/10'
                  }`}
                  key={`${item.time}-${item.event}`}
                >
                  <span className="text-sm text-slate-400">{item.time}</span>
                  <strong className="text-sm font-semibold text-slate-100">
                    {item.event}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </main>
        </div>
      </div>
    </div>
  )
}

export default App
