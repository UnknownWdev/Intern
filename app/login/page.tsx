"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/features/auth/authSlice";
import type { AppDispatch, RootState } from "@/store/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return;
    }

    dispatch(loginUser({ username: trimmedUsername, password: trimmedPassword }));
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16 text-foreground">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
