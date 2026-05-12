import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import Player from '@/components/Player/Player';
import PlayerProvider from '@/providers/PlayerProvider';
import useAuth from '@/hooks/useAuth';

export default function Layout() {
  const { credentials, logout } = useAuth();

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto grid min-h-screen w-full grid-cols-[232px_1fr]">
          <Sidebar onLogout={logout} username={credentials?.username} />
          <main className="min-w-0 pb-[76px]">
            <Outlet />
          </main>
        </div>
      </div>
      <Player />
    </PlayerProvider>
  );
}
