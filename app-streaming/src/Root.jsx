import { useState } from 'react'
import App from './App.jsx'
import AddCam from './addCam.jsx'
import Login from './login.jsx'
import { Routes, Route } from 'react-router-dom'

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <Routes>
      <Route path="/" element={<App onLogout={() => setIsAuthenticated(false)} />} />
      <Route path="/addCam" element={<AddCam />} />
    </Routes>
  )
}

export default Root
