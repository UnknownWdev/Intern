import { call, put, takeLatest } from "redux-saga/effects";
import {
  createPostApi,
  deletePostApi,
  fetchPostsApi,
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
} from "@/store/features/posts/postsSlice";

function* fetchPostsSaga() {
  try {
    yield put(fetchPostsPending());
    const posts: BlogPost[] = yield call(fetchPostsApi);
    yield put(fetchPostsSuccess(posts));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch posts";
    yield put(fetchPostsFailure(message));
  }
}

function* searchPostsSaga(action: ReturnType<typeof searchPosts>) {
  try {
    yield put(searchPostsPending());
    const posts: BlogPost[] = yield call(searchPostsApi, action.payload);
    yield put(searchPostsSuccess(posts));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    yield put(searchPostsFailure(message));
  }
}

function* createPostSaga(action: ReturnType<typeof createPost>) {
  try {
    yield put(createPostPending());
    const post: BlogPost = yield call(createPostApi, action.payload);
    yield put(createPostSuccess(post));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    yield put(createPostFailure(message));
  }
}

function* updatePostSaga(action: ReturnType<typeof updatePost>) {
  try {
    yield put(updatePostPending());
    const post: BlogPost = yield call(updatePostApi, action.payload.id, action.payload.updates);
    yield put(updatePostSuccess(post));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    yield put(updatePostFailure(message));
  }
}

function* deletePostSaga(action: ReturnType<typeof deletePost>) {
  try {
    yield put(deletePostPending());
    const id: number = yield call(deletePostApi, action.payload);
    yield put(deletePostSuccess(id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post";
    yield put(deletePostFailure(message));
  }
}

export function* watchPosts() {
  yield takeLatest(fetchPosts.type, fetchPostsSaga);
  yield takeLatest(searchPosts.type, searchPostsSaga);
  yield takeLatest(createPost.type, createPostSaga);
  yield takeLatest(updatePost.type, updatePostSaga);
  yield takeLatest(deletePost.type, deletePostSaga);
}
