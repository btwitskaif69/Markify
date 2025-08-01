import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner"  

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <App />
     <Toaster theme="dark" position="bottom-right" richColors closeButton />
  </StrictMode>
  </BrowserRouter>,
)
