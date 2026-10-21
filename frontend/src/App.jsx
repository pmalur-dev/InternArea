
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import useAuth from './hooks/useAuth'
import './styles/global.css'

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const [authMode, setAuthMode] = useState(null)

  async function handleLogout() {
    try {
      await signOut()
      setAuthMode(null)
    } catch (err) {
      alert(err.message || 'Logout failed.')
    }
  }

  async function handleSignIn(credentials) {
    await signIn(credentials)
    setAuthMode(null)
  }

  async function handleSignUp(details) {
    await signUp(details)
    setAuthMode(null)
  }

  return (
    <>
      <Navbar
        user={user}
        onLogin={() => setAuthMode('login')}
        onRegister={() => setAuthMode('register')}
        onLogout={handleLogout}
      />

      {loading ? (
        <main className="page-loading">Checking your session...</main>
      ) : authMode ? (
        <Auth
          mode={authMode}
          setMode={setAuthMode}
          signIn={handleSignIn}
          signUp={handleSignUp}
        />
      ) : (
        <Home user={user} />
      )}

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} InternArea. Find your next opportunity.</p>
      </footer>
    </>
  )
}