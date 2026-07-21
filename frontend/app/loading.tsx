export default function Loading() {
  return (
    <main
      className="loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-a">A</span>
        </div>

        <div className="loading-spinner" />

        <p className="loading-text">
          Loading...
        </p>
      </div>
    </main>
  );
}