import React from 'react'
import { useNavigate } from 'react-router-dom'

function AddCam({ onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_32%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_28%),linear-gradient(180deg,#1a0000,#080000_35%,#000000_100%)] text-white">
      
      {/* REJILLA FONDO */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />
      
      {/* CONTENIDO */}
      <div className="mx-auto flex min-h-screen w-full flex-col gap-6 p-4 sm:p-8 xl:p-10">
        
        {/* HEADER ESTILO ORIGINAL */}
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between relative z-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white">Liga amateur broadcast suite</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">Ajustes de Cámara</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* BOTÓN PARA VOLVER COMPLETAMENTE FUNCIONAL */}
            <button 
              onClick={() => navigate('/')} 
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/8 transition"
            >
              Volver al Control Room
            </button>
            
            <button 
              onClick={onLogout} 
              className="rounded-2xl border border-white/10 bg-red-500/10 text-red-400 px-6 py-3 text-sm font-medium hover:bg-red-500/20 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Zona de contenido para el formulario de agregar cámara */}
        <main className="relative z-10 rounded-[28px] border border-white/10 bg-black/75 p-8 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.28)] mt-6">
          <p className="text-sm text-white">Ventana de configuración nativa lista para agregar nuevas fuentes de vídeo a Electron.</p>
        </main>
        
      </div>
    </div>
  )
}

export default AddCam