import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner"  
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <AuthProvider>
    <App />
     <Toaster theme="dark" position="bottom-right" richColors closeButton />
     </AuthProvider>
  </StrictMode>
  </BrowserRouter>,
)
