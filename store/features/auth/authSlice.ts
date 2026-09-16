import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi, type User, type AuthCredentials } from "@/services/dummyJsonApi";

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

export const loginUser = createAsyncThunk<
  { token: string; user: User },
  AuthCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    return await loginUserApi(credentials);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to sign in",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ token: action.payload.token, user: action.payload.user }),
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to sign in";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
