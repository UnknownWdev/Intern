import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type User, type AuthCredentials } from "@/services/dummyJsonApi";

export type { User } from "@/services/dummyJsonApi";

const AUTH_STORAGE_KEY = "dummyjson-auth";

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const readStoredAuth = (): Pick<AuthState, "token" | "user"> => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(stored) as Partial<AuthState>;
    return {
      token: typeof parsed.token === "string" ? parsed.token : null,
      user: parsed.user ?? null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const storedAuth = readStoredAuth();

const initialState: AuthState = {
  token: storedAuth.token ?? null,
  user: storedAuth.user ?? null,
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
      state.error = null;
      state.loading = false;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
    restoreAuth: (state, action: PayloadAction<{ token: string | null; user: User | null }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    loginUserSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ token: action.payload.token, user: action.payload.user }),
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
