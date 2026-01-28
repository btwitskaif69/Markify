"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or refresh the page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
