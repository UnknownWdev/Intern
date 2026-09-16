import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type User, type AuthCredentials } from "@/services/dummyJsonApi";

export type { User } from "@/services/dummyJsonApi";

const AUTH_STORAGE_KEY = "dummyjson-auth";

type AuthState = {
  token: string | null;
  user: User | null;
  expiresAt: number | null;
  loading: boolean;
  error: string | null;
};

const parseJwtExpiry = (token: string | null): number | null => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { exp?: number };
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

const readStoredAuth = (): Pick<AuthState, "token" | "user" | "expiresAt"> => {
  if (typeof window === "undefined") {
    return { token: null, user: null, expiresAt: null };
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return { token: null, user: null, expiresAt: null };
    }

    const parsed = JSON.parse(stored) as Partial<AuthState>;
    const token = typeof parsed.token === "string" ? parsed.token : null;
    return {
      token,
      user: parsed.user ?? null,
      expiresAt: parseJwtExpiry(token),
    };
  } catch {
    return { token: null, user: null, expiresAt: null };
  }
};

const storedAuth = readStoredAuth();

const initialState: AuthState = {
  token: storedAuth.token ?? null,
  user: storedAuth.user ?? null,
  expiresAt: storedAuth.expiresAt ?? null,
  loading: false,
  error: null,
};

export const loginUser = createAction<AuthCredentials>("auth/loginUser");
export const loginUserSuccess = createAction<{ token: string; user: User }>("auth/loginUserSuccess");
export const loginUserFailure = createAction<string>("auth/loginUserFailure");
export const restoreAuth = createAction<{ token: string | null; user: User | null }>("auth/restoreAuth");

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.expiresAt = null;
      state.error = null;
      state.loading = false;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
    restoreAuth: (state, action: PayloadAction<{ token: string | null; user: User | null }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.expiresAt = parseJwtExpiry(action.payload.token);
      state.error = null;
    },
    loginUserSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.expiresAt = parseJwtExpiry(action.payload.token);
      state.error = null;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            token: action.payload.token,
            user: action.payload.user,
            expiresAt: state.expiresAt,
          }),
        );
      }
    },
    loginUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginUserPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginUserReset: (state) => {
      state.error = null;
    },
  },
});

export const {
  logout,
  restoreAuth: restoreAuthState,
  loginUserPending,
  loginUserReset,
  loginUserSuccess: loginUserSucceeded,
  loginUserFailure: loginUserFailed,
} = authSlice.actions;

export default authSlice.reducer;
