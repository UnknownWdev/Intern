"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { logout, restoreAuth } from "@/store/features/auth/authSlice";
import type { User } from "@/services/dummyJsonApi";
import { store } from "@/store/store";

function StoreInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth only on the client because localStorage is unavailable during SSR.
    const saved = window.localStorage.getItem("dummyjson-auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { token?: string | null; user?: unknown };
        dispatch(restoreAuth({ token: parsed.token ?? null, user: (parsed.user as User | null) ?? null }));
      } catch {
        dispatch(logout());
      }
    }

    const handleExpiry = () => {
      const current = store.getState().auth;
      if (current.token && current.expiresAt && Date.now() > current.expiresAt) {
        dispatch(logout());
      }
    };

    handleExpiry();
    const interval = window.setInterval(handleExpiry, 30000);

    return () => window.clearInterval(interval);
  }, [dispatch]);

  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer />
      {children}
    </Provider>
  );
}
