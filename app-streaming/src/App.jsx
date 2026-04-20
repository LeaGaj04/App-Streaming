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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(48,124,199,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,137,61,0.16),transparent_28%),linear-gradient(180deg,#10263d,#07111c_35%,#050a12_100%)] text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-7">
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
  )
}

export default App
