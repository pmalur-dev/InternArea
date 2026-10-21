import '../styles/InternshipCard.css'

export default function InternshipCard({ internship, user, onEdit, onDelete }) {
  const canManage =
    user?.role === 'employer' &&
    String(internship.employer?._id || internship.employer) === String(user.id || user._id)

  return (
    <article className="internship-card">
      <div className="company-mark">
        {(internship.company || 'I').charAt(0).toUpperCase()}
      </div>

      <div className="internship-details">
        <h3>{internship.title}</h3>
        <p className="company-name">{internship.company}</p>

        <div className="internship-meta">
          <span>📍 {internship.location || 'Location not specified'}</span>
          <span>
            ₹{Number(internship.stipend || 0).toLocaleString('en-IN')}/month
          </span>
        </div>

        {canManage && (
          <div className="card-actions">
            <button type="button" onClick={() => onEdit(internship)}>Edit</button>
            <button type="button" onClick={() => onDelete(internship._id)}>Delete</button>
          </div>
        )}
      </div>
    </article>
  )
}