import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPostApi,
  deletePostApi,
  fetchPostsApi,
  fetchPostByIdApi,
  searchPostsApi,
  updatePostApi,
  type BlogPost,
} from "@/services/dummyJsonApi";

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

export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPostsApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unable to fetch posts",
      );
    }
  },
);

export const fetchPostById = createAsyncThunk<Post, number, { rejectValue: string }>(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchPostByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unable to load post",
      );
    }
  },
);

export const searchPosts = createAsyncThunk<Post[], string, { rejectValue: string }>(
  "posts/searchPosts",
  async (query, { rejectWithValue }) => {
    try {
      return await searchPostsApi(query);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Search failed",
      );
    }
  },
);

export const createPost = createAsyncThunk<
  Post,
  Partial<Post> & { title: string; body: string },
  { rejectValue: string }
>("posts/createPost", async (post, { rejectWithValue }) => {
  try {
    return await createPostApi(post);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create post",
    );
  }
});

export const updatePost = createAsyncThunk<
  Post,
  { id: number; updates: Partial<Post> },
  { rejectValue: string }
>("posts/updatePost", async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await updatePostApi(id, updates);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update post",
    );
  }
});

export const deletePost = createAsyncThunk<number, number, { rejectValue: string }>(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      return await deletePostApi(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete post",
      );
    }
  },
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch posts";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
        if (state.selectedPost && state.selectedPost.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.selectedPost && state.selectedPost.id === action.payload) {
          state.selectedPost = null;
        }
      });
  },
});

export const { clearSelectedPost } = postsSlice.actions;
export default postsSlice.reducer;
