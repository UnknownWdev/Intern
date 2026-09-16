import { call, put, takeLatest } from "redux-saga/effects";
import { loginUserApi, type User, type AuthCredentials } from "@/services/dummyJsonApi";
import {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  loginUserPending,
  logout,
} from "@/store/features/auth/authSlice";

function* loginUserSaga(action: ReturnType<typeof loginUser>) {
  try {
    yield put(loginUserPending());

    const credentials: AuthCredentials = action.payload;
    const response: { token: string; user: User } = yield call(
      loginUserApi,
      credentials,
    );

    yield put(loginUserSuccess(response));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in";
    yield put(loginUserFailure(message));
  }
}

export function* watchAuth() {
  yield takeLatest(loginUser.type, loginUserSaga);
  yield takeLatest(logout.type, function* () {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("dummyjson-auth");
    }
  });
}
