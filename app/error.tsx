"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <h2 className="text-3xl font-bold text-slate-900">Something went wrong.</h2>
      <p className="mt-4 text-slate-600">The page could not be loaded. Please try again.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
      >
        Try again
      </button>
    </main>
  );
}
