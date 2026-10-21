
import { useState } from 'react'
import ErrorMessage from './ErrorMessage'

export default function LoginForm({ onSubmit, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({ email, password })
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      <ErrorMessage message={error} />

      <label>Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>

      <label>Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>

      <button disabled={loading} type="submit">
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p>New here? <button type="button" className="text-button" onClick={onSwitch}>Create an account</button></p>
    </form>
  )
}