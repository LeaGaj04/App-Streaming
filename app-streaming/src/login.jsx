function Login({ onLogin }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_32%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_28%),linear-gradient(180deg,#1a0000,#080000_35%,#000000_100%)] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />

      <div className="mx-auto flex min-h-screen w-full items-center justify-center p-4 relative z-10">
        <section className="w-full max-w-md relative overflow-hidden rounded-[32px] border border-white/10 bg-black/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur xl:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white/70">
                Liga Amateur Broadcast Suite
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white">
                Acceso al control room
              </h1>
            </div>

            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault()
                onLogin()
              }}
            >
              <label className="grid gap-2">
                <span className="text-sm font-medium text-white/90">
                  Correo o usuario
                </span>
                <input
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/40 focus:border-red-400/50 focus:bg-white/[0.06]"
                  type="text"
                  placeholder="operador@liga.local"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-white/90">
                  Contraseña
                </span>
                <input
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/40 focus:border-red-400/50 focus:bg-white/[0.06]"
                  type="password"
                  placeholder="••••••••"
                />
              </label>

              <div className="flex items-center justify-between text-sm text-white pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    className="h-4 w-4 rounded border-white/10 bg-white/5 accent-red-500 cursor-pointer"
                    type="checkbox"
                    defaultChecked
                  />
                  <span className="text-white/80">Mantener sesión</span>
                </label>
              </div>

              <button
                className="mt-4 w-full rounded-2xl bg-linear-to-br from-red-500 to-red-700 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                type="submit"
              >
                Ingresar a cabina
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
