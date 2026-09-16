import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi, type User, type AuthCredentials } from "@/services/dummyJsonApi";

export type { User } from "@/services/dummyJsonApi";

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to sign in";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
