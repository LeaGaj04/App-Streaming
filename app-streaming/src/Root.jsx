import { useState } from 'react'
import App from './App.jsx'
import AddCam from './addCam.jsx'
import Login from './login.jsx'
import { Routes, Route } from 'react-router-dom'

const DEFAULT_CAMERA_FEEDS = [
  { id: 'cam-1', label: 'Camara 1', role: 'Master lateral', status: 'En linea', deviceId: null },
  { id: 'cam-2', label: 'Camara 2', role: 'Arco norte', status: 'En linea', deviceId: null },
  { id: 'cam-3', label: 'Camara 3', role: 'Banca y staff', status: 'Listo', deviceId: null },
  { id: 'cam-4', label: 'Camara 4', role: 'Movil cancha', status: 'Chequeo', deviceId: null },
];

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cameraFeeds, setCameraFeeds] = useState(DEFAULT_CAMERA_FEEDS)

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <Routes>
      <Route path="/" element={<App onLogout={() => setIsAuthenticated(false)} cameraFeeds={cameraFeeds} />} />
      <Route path="/addCam" element={<AddCam onLogout={() => setIsAuthenticated(false)} cameraFeeds={cameraFeeds} setCameraFeeds={setCameraFeeds} />} />
      <Route path="/dashboard" element={<App onLogout={() => setIsAuthenticated(false)} cameraFeeds={cameraFeeds} />} />
      <Route path="/CamaraConfig" element={<AddCam onLogout={() => setIsAuthenticated(false)} cameraFeeds={cameraFeeds} setCameraFeeds={setCameraFeeds} />} />
    </Routes>
  )
}

export default Root
