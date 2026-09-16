import Link from "next/link";
import type { BlogPost } from "@/services/dummyJsonApi";

async function getPosts(): Promise<BlogPost[]> {
  const response = await fetch("https://dummyjson.com/posts?limit=12", {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.posts ?? [];
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Blog</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Latest posts</h1>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Post #{post.id}</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.body}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">{post.tags[0] ?? "general"}</span>
              <Link href={`/posts/${post.id}`} className="text-sm font-semibold text-slate-900 hover:text-slate-700">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
