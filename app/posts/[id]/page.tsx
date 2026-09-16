import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { type BlogPost } from "@/services/dummyJsonApi";

async function getPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`https://dummyjson.com/posts/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  return {
    title: post ? `${post.title} | DummyJSON Blog` : "Post not found",
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Story
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              #{tag}
            </span>
          ))}
        </div>
        <p className="mt-8 text-lg leading-8 text-slate-700">{post.body}</p>
      </article>
    </main>
  );
}
