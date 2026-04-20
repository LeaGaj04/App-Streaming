import { useState } from 'react'
import App from './App.jsx'
import Login from './login.jsx'

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return <App onLogout={() => setIsAuthenticated(false)} />
}

export default Root
