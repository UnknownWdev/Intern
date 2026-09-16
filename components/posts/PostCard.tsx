"use client";

import type { BlogPost } from "@/services/dummyJsonApi";

type PostCardProps = {
  post: BlogPost;
  isAuthenticated: boolean;
  onUpdate: (postId: number) => void;
  onDelete: (postId: number) => void;
};

export function PostCard({ post, isAuthenticated, onUpdate, onDelete }: PostCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">
        <span>User {post.userId}</span>
        <span>{post.tags.join(" • ")}</span>
      </div>

      <h2 className="mb-3 text-2xl font-semibold leading-tight text-slate-900">
        {post.title}
      </h2>

      <p className="mb-4 text-sm leading-7 text-slate-600">{post.body}</p>

      <div className="mb-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
        <span>👍 {post.reactions.likes}</span>
        <span>👎 {post.reactions.dislikes}</span>
      </div>

      {isAuthenticated && (
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onUpdate(post.id)}
            className="rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="rounded-full border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
