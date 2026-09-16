"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { BlogPost, User } from "@/services/dummyJsonApi";
import type { RootState } from "@/store/store";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://dummyjson.com/posts?limit=100", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load posts");
        }

        const data = await response.json();
        const authoredPosts = (data.posts ?? []).filter((post: BlogPost) => post.userId === user.id);
        setPosts(authoredPosts);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Please log in to view your profile.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200">
            <Image
              src={user.image || "https://dummyjson.com/icon/emilys/128"}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Profile</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-300">@{user.username}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{user.email}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Posts</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{posts.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{(user as User & { role?: string }).role ?? "Writer"}</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your posts</h2>

        {loading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-slate-600 dark:text-slate-300">You have not published any posts yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Post #{post.id}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{post.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
