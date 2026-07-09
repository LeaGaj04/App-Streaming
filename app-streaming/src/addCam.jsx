import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AddCam({ onLogout, cameraFeeds, setCameraFeeds }) {
  const navigate = useNavigate()
  const [availableDevices, setAvailableDevices] = useState([])
  const [localFeeds, setLocalFeeds] = useState(cameraFeeds || [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Pedir permiso para obtener los nombres reales de los dispositivos
        await navigator.mediaDevices.getUserMedia({ video: true })
        
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(d => d.kind === 'videoinput')
        setAvailableDevices(videoDevices)
      } catch (err) {
        console.error("Error al acceder a dispositivos", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDevices()
  }, [])

  const handleDeviceChange = (feedId, newDeviceId) => {
    setLocalFeeds(prev => prev.map(feed => 
      feed.id === feedId ? { ...feed, deviceId: newDeviceId, status: newDeviceId ? 'En linea' : 'Offline' } : feed
    ))
  }

  const handleSave = () => {
    if (setCameraFeeds) {
      setCameraFeeds(localFeeds)
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.1),transparent_32%),radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_28%),linear-gradient(180deg,#1a0000,#080000_35%,#000000_100%)] text-white">
      
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />
      
      <div className="mx-auto flex min-h-screen w-full flex-col gap-6 p-4 sm:p-8 xl:p-10">
        
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between relative z-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white">Liga amateur broadcast suite</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">Asignación de Cámaras</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/8 transition"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave} 
              className="rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            >
              Guardar Cambios
            </button>
          </div>
        </header>

        <main className="relative z-10 rounded-2xl border border-white/10 bg-black/80 p-8 backdrop-blur shadow-2xl mt-6 max-w-4xl mx-auto w-full">
          {isLoading ? (
            <div className="py-12 text-center text-white/50 text-sm font-bold uppercase tracking-widest">
              Buscando dispositivos de hardware...
            </div>
          ) : (
            <div className="grid gap-6">
              {localFeeds.map((feed, index) => (
                <div key={feed.id} className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-black border border-white/10 shrink-0">
                    <span className="text-xl font-black text-white/80">{index + 1}</span>
                  </div>
                  
                  <div className="w-48 shrink-0">
                    <h3 className="text-lg font-bold text-white">{feed.label}</h3>
                    <p className="text-[10px] uppercase text-white/50">{feed.role}</p>
                  </div>

                  <div className="flex-1">
                    <select
                      value={feed.deviceId || ''}
                      onChange={(e) => handleDeviceChange(feed.id, e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/20 bg-black px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition"
                    >
                      <option value="">-- No Asignada (Offline) --</option>
                      {availableDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Cámara Desconocida (${device.deviceId.slice(0,5)}...)`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <div className="mt-4 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="text-xs text-blue-300 leading-relaxed">
                  <strong>💡 Consejo:</strong> Si acabas de conectar un teléfono por USB (ej. DroidCam) o una capturadora HDMI nueva, y no aparece en la lista, asegúrate de haber dado permisos al navegador y recarga la página.
                </p>
              </div>
            </div>
          )}
        </main>
        
      </div>
    </div>
  )
}

export default AddCam