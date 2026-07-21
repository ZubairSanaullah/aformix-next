"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  // Future monitoring services
  // Sentry.captureException(error);
}, [error]);

  return (
    <main
        className="error-page"
        role="alert"
        aria-live="assertive"
    >
      <div className="error-container">
        <span className="error-badge">
          Something went wrong
        </span>

        <h1>
           Oops! Something went wrong
        </h1>

        <p>
          An unexpected error occurred while loading this page.
          Please try again or return to the homepage.
        </p>

        <div className="error-actions">
        <button
            onClick={reset}
            className="error-button"
        >
            Try Again
        </button>

        <Link
            href="/"
            className="error-secondary"
        >
            Back Home
        </Link>
        </div>

      </div>
    </main>
  );
}