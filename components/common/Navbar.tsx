"use client";

import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Signup", href: "/signup" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          DummyJSON Blog
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
