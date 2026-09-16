"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, fetchComments } from "@/store/features/comments/commentsSlice";
import type { RootState } from "@/store/store";

type CommentsPanelProps = { postId: number };

export function CommentsPanel({ postId }: CommentsPanelProps) {
  const dispatch = useDispatch();
  const { items, loading, submitting, error } = useSelector((state: RootState) => state.comments);
  const token = useSelector((state: RootState) => state.auth.token);
  const [body, setBody] = useState("");

  useEffect(() => {
    dispatch(fetchComments(postId) as never);
  }, [dispatch, postId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedBody = body.trim();
    if (!token || !trimmedBody) return;
    dispatch(addComment({ postId, body: trimmedBody }) as never);
    setBody("");
  };

  return (
    <section className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Comments</h2>
        {loading && <span className="text-sm text-slate-500">Loading...</span>}
      </div>

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!loading && items.length === 0 && <p className="mt-4 text-sm text-slate-500">No comments yet.</p>}
      <div className="mt-4 space-y-3">
        {items.map((comment) => (
          <div key={comment.id} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{comment.user.fullName || comment.user.username}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{comment.body}</p>
          </div>
        ))}
      </div>

      {token ? (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Add a comment"
            aria-label="Comment"
            className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-transparent px-4 text-sm outline-none focus:border-emerald-600 dark:border-slate-700"
          />
          <button type="submit" disabled={submitting || !body.trim()} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {submitting ? "Posting..." : "Comment"}
          </button>
        </form>
      ) : (
        <p className="mt-5 text-sm text-slate-500">Sign in to join the conversation.</p>
      )}
    </section>
  );
}
