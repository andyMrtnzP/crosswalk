import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import Album from '@/pages/Album';
import Artist from '@/pages/Artist';
import Artists from '@/pages/Artists';
import Library from '@/pages/Library';
import Playlists from '@/pages/Playlists';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import useAuth from '@/hooks/useAuth';
import Albums from '@/pages/Albums';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
