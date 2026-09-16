"use client";

import { withAuth } from "@/components/auth/withAuth";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-4 text-lg text-slate-600">
        Welcome back, {user.firstName} {user.lastName}.
      </p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
        <p>
          <span className="font-semibold">Username:</span> @{user.username}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>
    </main>
  );
}

export default withAuth(DashboardPage);
