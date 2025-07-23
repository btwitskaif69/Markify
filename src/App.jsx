import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import { ThemeProvider } from "@/components/theme-provider"

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
          <Route path="/" element={<Dashboard/>} />
      </Routes>
    </ThemeProvider>
  )
}

export default App