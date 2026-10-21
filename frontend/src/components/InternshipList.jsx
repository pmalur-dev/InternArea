
import InternshipCard from './InternshipCard'
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'

export default function InternshipList({
  internships,
  loading,
  error,
  user,
  onEdit,
  onDelete,
}) {
  if (loading) return <Loading message="Finding internships..." />

  return (
    <section className="internship-section">
      <div className="section-heading">
        <div>
          <h2>Latest internships</h2>
          <p>Explore opportunities to get started.</p>
        </div>
        <span>{internships.length} opportunities</span>
      </div>

      <ErrorMessage message={error} />

      {internships.length === 0 && !error ? (
        <p className="empty-state">No internships found. Try another search.</p>
      ) : (
        <div className="internship-grid">
          {internships.map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}