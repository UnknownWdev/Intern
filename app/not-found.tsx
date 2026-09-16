import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">404</p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
      >
        Return home
      </Link>
    </main>
  );
}
