export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 h-7 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 h-3 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="mb-3 h-7 w-3/4 animate-pulse rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="mt-5 h-10 w-full animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
