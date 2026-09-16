import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type BlogPost } from "@/services/dummyJsonApi";

export type Post = BlogPost;

type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  selectedPost: Post | null;
};

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  selectedPost: null,
};

export const fetchPosts = createAction<void>("posts/fetchPosts");
export const fetchPostsPending = createAction("posts/fetchPostsPending");
export const fetchPostsSuccess = createAction<Post[]>("posts/fetchPostsSuccess");
export const fetchPostsFailure = createAction<string>("posts/fetchPostsFailure");
export const fetchPostById = createAction<number>("posts/fetchPostById");
export const fetchPostByIdSuccess = createAction<Post>("posts/fetchPostByIdSuccess");
export const searchPosts = createAction<string>("posts/searchPosts");
export const searchPostsPending = createAction("posts/searchPostsPending");
export const searchPostsSuccess = createAction<Post[]>("posts/searchPostsSuccess");
export const searchPostsFailure = createAction<string>("posts/searchPostsFailure");
export const createPost = createAction<Partial<Post> & { title: string; body: string }>("posts/createPost");
export const createPostPending = createAction("posts/createPostPending");
export const createPostSuccess = createAction<Post>("posts/createPostSuccess");
export const createPostFailure = createAction<string>("posts/createPostFailure");
export const updatePost = createAction<{ id: number; updates: Partial<Post> }>("posts/updatePost");
export const updatePostPending = createAction("posts/updatePostPending");
export const updatePostSuccess = createAction<Post>("posts/updatePostSuccess");
export const updatePostFailure = createAction<string>("posts/updatePostFailure");
export const deletePost = createAction<number>("posts/deletePost");
export const deletePostPending = createAction("posts/deletePostPending");
export const deletePostSuccess = createAction<number>("posts/deletePostSuccess");
export const deletePostFailure = createAction<string>("posts/deletePostFailure");

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    fetchPostsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = null;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPostByIdSuccess: (state, action: PayloadAction<Post>) => {
      state.selectedPost = action.payload;
    },
    searchPostsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = null;
    },
    searchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPostPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess: (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.posts = [action.payload, ...state.posts];
      state.error = null;
    },
    createPostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePostPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePostSuccess: (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post,
      );
      if (state.selectedPost && state.selectedPost.id === action.payload.id) {
        state.selectedPost = action.payload;
      }
      state.error = null;
    },
    updatePostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deletePostPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePostSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      if (state.selectedPost && state.selectedPost.id === action.payload) {
        state.selectedPost = null;
      }
      state.error = null;
    },
    deletePostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  clearSelectedPost,
  fetchPostsPending: fetchPostsLoading,
  fetchPostsFailure: fetchPostsRejected,
  fetchPostsSuccess: fetchPostsSucceeded,
  searchPostsSuccess: searchPostsSucceeded,
  searchPostsFailure: searchPostsFailed,
  createPostSuccess: createPostSucceeded,
  createPostFailure: createPostRejected,
  updatePostSuccess: updatePostSucceeded,
  updatePostFailure: updatePostRejected,
  deletePostSuccess: deletePostSucceeded,
  deletePostFailure: deletePostRejected,
} = postsSlice.actions;

export default postsSlice.reducer;
