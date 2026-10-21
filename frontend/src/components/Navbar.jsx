
import '../styles/Navbar.css'

export default function Navbar({ user, onLogin, onRegister, onLogout }) {
  return (
    <header className="navbar">
      <a className="brand" href="/" aria-label="InternArea home">
        Intern<span>Area</span>
      </a>

      <nav aria-label="Main navigation">
        {user ? (
          <>
            <span className="welcome">Hi, {user.name}</span>
            <button className="nav-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-button" onClick={onLogin}>Login</button>
            <button className="nav-button nav-primary" onClick={onRegister}>
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  )
}