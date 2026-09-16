export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-[var(--foreground)]">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">About</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
        This blog app demonstrates a Redux-powered Next.js architecture using public
        DummyJSON APIs for authentication and content management.
      </p>
    </main>
  );
}
