import Home from '@/pages/Home'
import Login from '@/pages/Login'
import useAuth from '@/hooks/useAuth'

const NAV_ITEMS = ['Home', 'Library', 'Artists', 'Playlists', 'Config'] as const

function App() {
  const { credentials, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated || !credentials) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-sidebar-border bg-sidebar px-4 py-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-sidebar-primary">Crosswalk</p>
            <p className="mt-1 text-sm text-sidebar-foreground/70">{credentials.username}</p>
          </div>

          <nav>
            <ul className="grid gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    type="button"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="mt-8 rounded-md border border-sidebar-border px-3 py-2 text-sm text-sidebar-foreground transition hover:bg-sidebar-accent"
            type="button"
            onClick={logout}
          >
            Sign out
          </button>
        </aside>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <Home />
        </main>
      </div>
    </div>
  )
}

export default App
