"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/features/auth/authSlice";
import type { AppDispatch, RootState } from "@/store/store";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const username = form.username.trim();
    const password = form.password.trim();
    const email = form.email.trim();

    if (!username || !password || !email) {
      setValidationError("Please complete all fields before signing up.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setValidationError(null);
    dispatch(loginUser({ username, password }));
    router.push("/dashboard");
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16 text-[var(--foreground)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create account</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Sign up to publish your own blog posts.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={form.username}
            onChange={(event) => handleChange("username", event.target.value)}
            placeholder="Username"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => handleChange("password", event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          {(validationError || error) && (
            <p className="text-sm text-red-600">{validationError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
