
import { useState } from 'react'
import ErrorMessage from './ErrorMessage'
import '../styles/Forms.css'

const initialValues = {
  title: '',
  company: '',
  location: '',
  stipend: '',
}

export default function InternshipForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...initialValues,
    ...initialData,
    stipend: initialData?.stipend ?? '',
  }))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.company.trim() ||
        !form.location.trim() || form.stipend === '') {
      setError('Please complete all fields.')
      return
    }

    const stipend = Number(form.stipend)

    if (!Number.isFinite(stipend) || stipend < 0) {
      setError('Enter a valid non-negative stipend.')
      return
    }

    setSaving(true)

    try {
      await onSave({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        stipend,
      })
    } catch (err) {
      setError(err.message || 'Could not save the internship.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="panel-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit internship' : 'Post an internship'}</h2>
      <ErrorMessage message={error} />

      {[
        ['title', 'Internship title'],
        ['company', 'Company'],
        ['location', 'Location'],
        ['stipend', 'Monthly stipend (₹)'],
      ].map(([name, label]) => (
        <label key={name}>
          {label}
          <input
            name={name}
            value={form[name]}
            onChange={handleChange}
            type={name === 'stipend' ? 'number' : 'text'}
            min={name === 'stipend' ? '0' : undefined}
            required
          />
        </label>
      ))}

      <div className="form-actions">
        <button disabled={saving} type="submit">
          {saving ? 'Saving...' : 'Save internship'}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}