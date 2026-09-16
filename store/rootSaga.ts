import { all, fork } from "redux-saga/effects";
import { watchAuth } from "@/store/features/auth/authSaga";
import { watchPosts } from "@/store/features/posts/postsSaga";
import { watchComments } from "@/store/features/comments/commentsSaga";

export function* rootSaga() {
  // Fork watchers independently so auth, posts, and comments can run concurrently.
  yield all([fork(watchAuth), fork(watchPosts), fork(watchComments)]);
}
