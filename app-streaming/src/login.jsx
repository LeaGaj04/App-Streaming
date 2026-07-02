function Login({ onLogin }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_32%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_28%),linear-gradient(180deg,#1a0000,#080000_35%,#000000_100%)] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />

      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] items-center gap-8 px-4 py-6 sm:px-6 xl:grid-cols-[1.1fr_0.9fr] xl:px-7">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8 xl:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white">
              Liga amateur broadcast suite
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
              Acceso al centro de transmision
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white sm:text-base">
              Inicia sesion para controlar camaras, gestionar escenas, lanzar
              la transmision y coordinar la operacion del partido desde una sola
              cabina.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <span className="mb-3 inline-flex rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300 ring-1 ring-inset ring-red-400/30">
                  En vivo
                </span>
                <p className="text-sm text-white">
                  Conmutacion de program y preview para transmisiones de
                  partido.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <span className="mb-3 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200 ring-1 ring-inset ring-amber-300/30">
                  PTZ
                </span>
                <p className="text-sm text-white">
                  Presets, movimientos de camara y control rapido del operativo.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <span className="mb-3 inline-flex rounded-full bg-slate-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white ring-1 ring-inset ring-slate-400/30">
                  Replay
                </span>
                <p className="text-sm text-white">
                  Eventos marcados para repeticiones y seguimiento del juego.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-black/70 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white">
                    Operacion lista
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Estado de cabina
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200 ring-1 ring-inset ring-emerald-300/30">
                  Online
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white">Fuentes disponibles</p>
                  <strong className="mt-1 block text-2xl font-semibold text-white">
                    4 camaras
                  </strong>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white">Perfil activo</p>
                  <strong className="mt-1 block text-2xl font-semibold text-white">
                    Jornada sabado
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-black/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8">
          <div className="mb-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white">
              Inicio de sesion
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
              Bienvenido al control room
            </h2>
            <p className="mt-3 text-sm leading-7 text-white">
              Usa esta pantalla como portal de acceso mientras prototipamos la
              autenticacion real del sistema.
            </p>
          </div>

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              onLogin()
            }}
          >
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white">
                Correo o usuario
              </span>
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white focus:border-red-400/50 focus:bg-white/[0.06]"
                type="text"
                placeholder="operador@liga.local"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-white">
                Contrasena
              </span>
              <input
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white focus:border-red-400/50 focus:bg-white/[0.06]"
                type="password"
                placeholder="********"
              />
            </label>

            <div className="mt-2 flex items-center justify-between gap-3 text-sm text-white">
              <label className="flex items-center gap-2">
                <input
                  className="h-4 w-4 rounded border-white/10 bg-white/5 accent-red-500"
                  type="checkbox"
                  defaultChecked
                />
                Mantener sesion operativa
              </label>
              <button
                className="text-white transition hover:text-white"
                type="button"
              >
                Recuperar acceso
              </button>
            </div>

            <button
              className="mt-4 rounded-2xl bg-linear-to-br from-red-500 to-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:scale-102 hover:-translate-y-0.5"
              type="submit"
            >
              Entrar al panel de transmision
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-white">Rol sugerido</p>
              <strong className="mt-1 block text-base font-semibold text-white">
                Director tecnico
              </strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-white">Modo</p>
              <strong className="mt-1 block text-base font-semibold text-white">
                Prototipo Electron + React
              </strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
