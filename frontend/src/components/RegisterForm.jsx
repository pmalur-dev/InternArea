
import { useState } from 'react'
import ErrorMessage from './ErrorMessage'

export default function RegisterForm({ onSubmit, onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      await onSubmit({ name: name.trim(), email, password })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <h2>Create your account</h2>
      <p>Registration creates a student account.</p>
      <ErrorMessage message={error} />

      <label>Full name
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>

      <label>Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>

      <label>Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
      </label>

      <button disabled={loading} type="submit">
        {loading ? 'Creating account...' : 'Register'}
      </button>

      <p>Already registered? <button type="button" className="text-button" onClick={onSwitch}>Login</button></p>
    </form>
  )
}