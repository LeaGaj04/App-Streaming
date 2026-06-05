{/*import { useState } from 'react'*/}
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function AddCam(onLogout) {
  {/*const [sidebarAbierta, setSidebarAbierta] = useState(false)*/}

  const navigate = useNavigate();
  const irHome = () => {
    navigate('/')
  };
  return (
    /* ######### COLOR FONDO ######### */
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(48,124,199,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,137,61,0.16),transparent_28%),linear-gradient(180deg,#10263d,#07111c_35%,#050a12_100%)] text-slate-200">
            {/* ######### REJILLA FONDO ######### */}
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent)]" />
            {/* ######### CONTENIDO ######### */}
            <div className="mx-auto flex min-h-screen w-full flex-col gap-6 p-4 sm:p-8 xl:p-10">
              {/* HEADER ESTILO ORIGINAL */}
              <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between relative z-10">
                <div className="max-w-3xl">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">Liga amateur broadcast suite</p>
                  <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-50 sm:text-5xl xl:text-6xl">Agregar Cámara</h1>
                </div>
                <div className="flex justify-end gap-4">
                  {/*<button onClick={() => setSidebarAbierta(true)} className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"><SidebarIcon /></button>*/}
                  <button onClick={irHome} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/8 transition">Home</button>
                  <button onClick={onLogout} className="flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/8 transition">Cerrar sesión</button>
                </div>
              </header>
              <main>
                <div className='container mx-auto'>
                  <Menu as="div" className="relative inline-block">
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-200 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                      Options
                      <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                    </MenuButton>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                          >
                            Account settings
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                          >
                            Support
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                          >
                            License
                          </a>
                        </MenuItem>
                        <form action="#" method="POST">
                          <MenuItem>
                            <button
                              type="submit"
                              className="block w-full px-4 py-2 text-left text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                            >
                              Sign out
                            </button>
                          </MenuItem>
                        </form>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>
              </main>
            </div>

    </div>
  )
}

{/*import React from 'react'*/}

{/*function AddCam() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <h1 className="text-2xl font-bold tracking-tighter mb-4">Ajustes de Emisión</h1>
      <p className="text-sm text-slate-400">Ventana emergente nativa lista para configurar.</p>
    </div>
  )
}*/}

export default AddCam

