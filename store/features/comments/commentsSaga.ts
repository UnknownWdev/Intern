import { call, put, select, takeLatest } from "redux-saga/effects";
import { addCommentApi, fetchCommentsApi, type Comment } from "@/services/dummyJsonApi";
import {
  addComment, addCommentFailure, addCommentPending, addCommentSuccess,
  fetchComments, fetchCommentsFailure, fetchCommentsPending, fetchCommentsSuccess,
} from "./commentsSlice";
import type { RootState } from "@/store/store";

const getToken = (state: RootState) => state.auth.token;
const errorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

function* fetchCommentsSaga(action: ReturnType<typeof fetchComments>) {
  try {
    yield put(fetchCommentsPending());
    const comments: Comment[] = yield call(fetchCommentsApi, action.payload);
    yield put(fetchCommentsSuccess(comments));
  } catch (error) { yield put(fetchCommentsFailure(errorMessage(error, "Unable to load comments"))); }
}

function* addCommentSaga(action: ReturnType<typeof addComment>) {
  try {
    yield put(addCommentPending());
    // Comments are protected operations, so the saga rejects unauthenticated requests before I/O.
    const token: string | null = yield select(getToken);
    if (!token) throw new Error("Sign in to add a comment");
    const comment: Comment = yield call(addCommentApi, action.payload.postId, action.payload.body, token);
    yield put(addCommentSuccess(comment));
  } catch (error) { yield put(addCommentFailure(errorMessage(error, "Unable to add comment"))); }
}

export function* watchComments() {
  yield takeLatest(fetchComments.type, fetchCommentsSaga);
  yield takeLatest(addComment.type, addCommentSaga);
}
