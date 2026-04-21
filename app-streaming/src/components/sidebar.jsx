function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Sidebar({ children }) {
  return (
    <aside className="w-full max-w-[280px] shrink-0 rounded-[28px] border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur">
      <div className="flex h-full flex-col gap-4">{children}</div>
    </aside>
  )
}

function SidebarHeader({ children }) {
  return <div className="border-b border-white/10 pb-4">{children}</div>
}

function SidebarBody({ children }) {
  return <div className="flex flex-1 flex-col gap-4">{children}</div>
}

function SidebarSection({ children }) {
  return <div className="grid gap-2">{children}</div>
}

function SidebarItem({ children, href = '#', active = false }) {
  return (
    <a
      className={joinClasses(
        'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white',
        active && 'bg-white/[0.08] text-white ring-1 ring-inset ring-white/10',
      )}
      href={href}
    >
      {children}
    </a>
  )
}

function SidebarLabel({ children }) {
  return <span className="font-medium">{children}</span>
}

export {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
}
