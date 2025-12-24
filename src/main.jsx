import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css'
import App from './App.jsx'
import './font.css';
import { Toaster } from "sonner"
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <App />
          <Toaster theme="dark" position="bottom-right" richColors closeButton />
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  </HelmetProvider>,
)
