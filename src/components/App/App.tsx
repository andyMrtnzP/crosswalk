import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import useAuth from '@/hooks/useAuth';

function App() {
  const { credentials, isAuthenticated, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('Home');

  if (!isAuthenticated || !credentials) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full grid-cols-[232px_1fr]">
        <Sidebar
          activeItem={activeNav}
          onNavClick={setActiveNav}
          onLogout={logout}
          username={credentials.username}
        />

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default App;
