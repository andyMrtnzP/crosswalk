import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import { AuthenticationProvider } from '@/providers/AuthenticationProvider';
import './global.css';
import PlayerProvider from './providers/PlayerProvider';
import ContextMenuProvider from './providers/ContextMenuProvider';
import StarProvider from './providers/StarProvider';
import ToastProvider from './providers/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthenticationProvider>
      <StarProvider>
        <PlayerProvider>
          <ToastProvider>
            <ContextMenuProvider>
              <App />
            </ContextMenuProvider>
          </ToastProvider>
        </PlayerProvider>
      </StarProvider>
    </AuthenticationProvider>
  </StrictMode>
);
