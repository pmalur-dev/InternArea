
import { useCallback, useEffect, useState } from 'react'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import InternshipList from '../components/InternshipList'
import InternshipForm from '../components/InternshipForm'
import Loading from '../components/Loading'
import * as internshipService from '../services/internshipService'
import '../styles/Home.css'

function extractInternships(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.internships)) return data.internships
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default function Home({ user }) {
  const [internships, setInternships] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const refresh = useCallback(async (query = '') => {
    setLoading(true)
    setError('')

    try {
      const result = await internshipService.getInternships(query)
      setInternships(extractInternships(result))
    } catch (err) {
      setError(err.message || 'Could not load internships.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function saveInternship(values) {
    if (editing) {
      await internshipService.updateInternship(editing._id, values)
    } else {
      await internshipService.createInternship(values)
    }

    setEditing(null)
    setShowForm(false)
    await refresh(search)
  }

  async function deleteInternship(id) {
    if (!window.confirm('Delete this internship?')) return

    try {
      await internshipService.deleteInternship(id)
      await refresh(search)
    } catch (err) {
      setError(err.message || 'Could not delete internship.')
    }
  }

  function startEdit(internship) {
    setEditing(internship)
    setShowForm(true)
  }

  function startCreate() {
    setEditing(null)
    setShowForm(true)
  }

  return (
    <main className="home-page">
      <Hero />

      <div className="home-content">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={() => refresh(search)}
        />

        {user?.role === 'employer' && (
          <div className="employer-toolbar">
            <p>Manage your internship opportunities.</p>
            <button onClick={startCreate}>+ Post internship</button>
          </div>
        )}

        {showForm && user?.role === 'employer' && (
          <div className="form-overlay">
            <InternshipForm
              key={editing?._id || 'new'}
              initialData={editing}
              onSave={saveInternship}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
            />
          </div>
        )}

        {loading ? (
          <Loading message="Loading internships..." />
        ) : (
          <InternshipList
            internships={internships}
            loading={false}
            error={error}
            user={user}
            onEdit={startEdit}
            onDelete={deleteInternship}
          />
        )}
      </div>
    </main>
  )
}