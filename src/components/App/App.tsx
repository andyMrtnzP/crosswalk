import Header from '@/components/Header/Header'
import Home from '@/pages/Home'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Home />
      </main>
    </div>
  )
}

export default App
