"use client";

import type { FormEvent } from "react";

type LoginPanelProps = {
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginPanel({
  username,
  password,
  loading,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginPanelProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 md:flex-row">
      <input
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
        placeholder="Username"
        className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-slate-500"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Password"
        className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-slate-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="w-full text-sm text-red-600 md:mt-2">{error}</p>}
    </form>
  );
}
