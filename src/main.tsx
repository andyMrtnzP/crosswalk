import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import { AuthenticationProvider } from '@/providers/AuthenticationProvider';
import './global.css';
import PlayerProvider from './providers/PlayerProvider';
import ContextMenuProvider from './providers/ContextMenuProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthenticationProvider>
      <PlayerProvider>
        <ContextMenuProvider>
          <App />
        </ContextMenuProvider>
      </PlayerProvider>
    </AuthenticationProvider>
  </StrictMode>
);
