import { all, fork } from "redux-saga/effects";
import { watchAuth } from "@/store/features/auth/authSaga";
import { watchPosts } from "@/store/features/posts/postsSaga";
import { watchComments } from "@/store/features/comments/commentsSaga";

export function* rootSaga() {
  yield all([fork(watchAuth), fork(watchPosts), fork(watchComments)]);
}
