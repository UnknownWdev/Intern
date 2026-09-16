import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  createPostApi,
  deletePostApi,
  fetchPostsApi,
  fetchPostByIdApi,
  searchPostsApi,
  updatePostApi,
  type BlogPost,
} from "@/services/dummyJsonApi";
import {
  createPost,
  createPostSuccess,
  createPostFailure,
  createPostPending,
  deletePost,
  deletePostSuccess,
  deletePostFailure,
  deletePostPending,
  fetchPosts,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostsPending,
  searchPosts,
  searchPostsSuccess,
  searchPostsFailure,
  searchPostsPending,
  updatePost,
  updatePostSuccess,
  updatePostFailure,
  updatePostPending,
  fetchPostById,
  fetchPostByIdPending,
  fetchPostByIdSuccess,
  fetchPostByIdFailure,
} from "@/store/features/posts/postsSlice";
import type { RootState } from "@/store/store";

const getToken = (state: RootState) => state.auth.token;
const errorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

function* fetchPostsSaga(action: ReturnType<typeof fetchPosts>) {
  try {
    yield put(fetchPostsPending());
    const options = action.payload ?? {};
    const page = options.page ?? 1;
    const limit = options.limit ?? 12;
    // DummyJSON uses offset pagination; translating page here keeps the UI API simple.
    const result: { posts: BlogPost[]; total: number } = yield call(fetchPostsApi, { limit, skip: (page - 1) * limit });
    yield put(fetchPostsSuccess({ ...result, page, limit }));
  } catch (error) {
    yield put(fetchPostsFailure(errorMessage(error, "Unable to fetch posts")));
  }
}

function* fetchPostByIdSaga(action: ReturnType<typeof fetchPostById>) {
  try {
    yield put(fetchPostByIdPending());
    const post: BlogPost = yield call(fetchPostByIdApi, action.payload);
    yield put(fetchPostByIdSuccess(post));
  } catch (error) { yield put(fetchPostByIdFailure(errorMessage(error, "Unable to load post"))); }
}

function* searchPostsSaga(action: ReturnType<typeof searchPosts>) {
  try {
    yield put(searchPostsPending());
    const posts: BlogPost[] = yield call(searchPostsApi, action.payload);
    yield put(searchPostsSuccess(posts));
  } catch (error) {
    yield put(searchPostsFailure(errorMessage(error, "Search failed")));
  }
}

function* createPostSaga(action: ReturnType<typeof createPost>) {
  try {
    yield put(createPostPending());
    // Read the current token at execution time, avoiding stale credentials in dispatched actions.
    const token: string | null = yield select(getToken);
    if (!token) throw new Error("Sign in to create a post");
    const post: BlogPost = yield call(createPostApi, action.payload, token);
    yield put(createPostSuccess(post));
  } catch (error) {
    yield put(createPostFailure(errorMessage(error, "Failed to create post")));
  }
}

function* updatePostSaga(action: ReturnType<typeof updatePost>) {
  try {
    yield put(updatePostPending());
    const token: string | null = yield select(getToken);
    if (!token) throw new Error("Sign in to update a post");
    const post: BlogPost = yield call(updatePostApi, action.payload.id, action.payload.updates, token);
    yield put(updatePostSuccess(post));
  } catch (error) {
    yield put(updatePostFailure(errorMessage(error, "Failed to update post")));
  }
}

function* deletePostSaga(action: ReturnType<typeof deletePost>) {
  try {
    yield put(deletePostPending());
    const token: string | null = yield select(getToken);
    if (!token) throw new Error("Sign in to delete a post");
    const id: number = yield call(deletePostApi, action.payload, token);
    yield put(deletePostSuccess(id));
  } catch (error) {
    yield put(deletePostFailure(errorMessage(error, "Failed to delete post")));
  }
}

export function* watchPosts() {
  yield takeLatest(fetchPosts.type, fetchPostsSaga);
  yield takeLatest(fetchPostById.type, fetchPostByIdSaga);
  yield takeLatest(searchPosts.type, searchPostsSaga);
  yield takeLatest(createPost.type, createPostSaga);
  yield takeLatest(updatePost.type, updatePostSaga);
  yield takeLatest(deletePost.type, deletePostSaga);
}
