
export default function SearchBar({ value, onChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by internship title or company"
        aria-label="Search internships"
      />
      <button type="submit">Search</button>
    </form>
  )
}