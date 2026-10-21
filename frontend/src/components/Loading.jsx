
export default function Loading({ message = 'Loading...' }) {
  return <p role="status" className="loading">{message}</p>
}