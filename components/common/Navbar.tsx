"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/features/auth/authSlice";
import type { RootState } from "@/store/store";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [dispatch]);

  const isAuthenticated = mounted && Boolean(token && user);
  const safeUser = isAuthenticated ? user : null;

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          DummyJSON Blog
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-900 dark:hover:text-slate-100">
              {item.label}
            </Link>
          ))}

          {!isAuthenticated || !safeUser ? (
            <>
              <Link href="/login" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                Login
              </Link>
              <Link href="/signup" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-200">
                @{safeUser.username}
              </Link>
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Logout
              </button>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
