import Link from "next/link";

export default function NotFound() {
  return (
    <main
        className="error-page"
        aria-labelledby="not-found-title"
    >
      <div className="error-container">

        <span className="error-code">
          404
        </span>

        <h1 id="not-found-title">
            Page Not Found
        </h1>

        <p>
          The page you're looking for may have been moved, renamed, or no longer exists.
        </p>

        <Link
          href="/"
          className="error-button"
        >
          Go Home
        </Link>

      </div>
    </main>
  );
}