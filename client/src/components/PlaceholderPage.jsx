export default function PlaceholderPage({ title, message }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p className="muted">{message || 'This page is coming soon.'}</p>
    </div>
  );
}