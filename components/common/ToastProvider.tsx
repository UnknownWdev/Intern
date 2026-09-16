"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export function showToast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("app:toast", {
      detail: { message, type },
    }),
  );
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: ToastType }>;
      const message = customEvent.detail?.message;
      const type = customEvent.detail?.type ?? "info";

      if (!message) {
        return;
      }

      const toast = {
        id: Date.now() + Math.random(),
        message,
        type,
      };

      setToasts((current) => [...current, toast]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 3200);
    };

    window.addEventListener("app:toast", handleToast);
    return () => window.removeEventListener("app:toast", handleToast);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            "rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm",
            toast.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            toast.type === "error" && "border-rose-200 bg-rose-50 text-rose-800",
            toast.type === "info" && "border-slate-200 bg-white text-slate-800",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
