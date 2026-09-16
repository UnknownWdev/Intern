import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Comment } from "@/services/dummyJsonApi";

type CommentsState = {
  items: Comment[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
};

const initialState: CommentsState = { items: [], loading: false, submitting: false, error: null };

export const fetchComments = createAction<number>("comments/fetchComments");
export const fetchCommentsPending = createAction("comments/fetchCommentsPending");
export const fetchCommentsSuccess = createAction<Comment[]>("comments/fetchCommentsSuccess");
export const fetchCommentsFailure = createAction<string>("comments/fetchCommentsFailure");
export const addComment = createAction<{ postId: number; body: string }>("comments/addComment");
export const addCommentPending = createAction("comments/addCommentPending");
export const addCommentSuccess = createAction<Comment>("comments/addCommentSuccess");
export const addCommentFailure = createAction<string>("comments/addCommentFailure");

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    fetchCommentsPending: (state) => { state.loading = true; state.error = null; },
    fetchCommentsSuccess: (state, action: PayloadAction<Comment[]>) => { state.loading = false; state.items = action.payload; },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload; },
    addCommentPending: (state) => { state.submitting = true; state.error = null; },
    addCommentSuccess: (state, action: PayloadAction<Comment>) => { state.submitting = false; state.items = [action.payload, ...state.items]; },
    addCommentFailure: (state, action: PayloadAction<string>) => { state.submitting = false; state.error = action.payload; },
  },
});

export default commentsSlice.reducer;
