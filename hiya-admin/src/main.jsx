import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/theme.css';
import { AuthProvider } from './context/AuthContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* All dashboard URLs start with /admin (same value as `base` in vite.config.js) */}
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
