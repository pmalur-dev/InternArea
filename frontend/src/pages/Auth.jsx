import '../styles/Forms.css'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

export default function Auth({ mode, setMode, signIn, signUp }) {
  return (
    <section className="auth-section">
      <div className="auth-intro">
        <p className="eyebrow">INTERNAREA</p>
        <h1>Your next opportunity is closer than you think.</h1>
        <p>Sign in to continue or create a student account to get started.</p>
      </div>

      <div className="auth-panel">
        {mode === 'register' ? (
          <RegisterForm
            onSubmit={signUp}
            onSwitch={() => setMode('login')}
          />
        ) : (
          <LoginForm
            onSubmit={signIn}
            onSwitch={() => setMode('register')}
          />
        )}
      </div>
    </section>
  )
}