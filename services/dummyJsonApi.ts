import { apiClient } from "@/services/apiClient";

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

export type BlogPost = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views?: number;
};

export type Comment = {
  id: number;
  body: string;
  postId: number;
  user: { id: number; username: string; fullName?: string };
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export const loginUserApi = async ({ username, password }: AuthCredentials) => {
  const loginResponse = await apiClient.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  const loginData = loginResponse.data;
  const token = loginData.accessToken ?? loginData.token;

  if (!token) {
    throw new Error("Login response did not include an access token");
  }

  const meResponse = await apiClient.get("/auth/me");
  const meData = meResponse.data;

  if (!meData || meData.message) {
    throw new Error(meData?.message || "Unable to get current user");
  }

  return {
    token,
    user: {
      ...meData,
      username: meData.username || username,
    } as User,
  };
};

export const signupUserApi = async ({ username, password, email }: AuthCredentials & { email?: string }) => {
  const response = await apiClient.post("/users/add", {
    username,
    password,
    email,
  });

  const data = response.data;
  if (!data || data.message) {
    throw new Error(data?.message || "Signup failed");
  }

  return data;
};

export const fetchPostsApi = async ({ limit = 12, skip = 0 }: { limit?: number; skip?: number } = {}) => {
  // Keep pagination in the API adapter so components and sagas work with page numbers.
  const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return { posts: (data.posts ?? []) as BlogPost[], total: typeof data.total === "number" ? data.total : 0 };
};

export const fetchPostByIdApi = async (id: number) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load post");
  }

  return data as BlogPost;
};

export const searchPostsApi = async (query: string) => {
  const response = await fetch(
    `https://dummyjson.com/posts/search?q=${encodeURIComponent(query)}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Search failed");
  }

  return data.posts ?? [] as BlogPost[];
};

export const fetchCommentsApi = async (postId: number) => {
  const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load comments");
  return (data.comments ?? []) as Comment[];
};

export const addCommentApi = async (postId: number, body: string, token: string) => {
  const response = await fetch("https://dummyjson.com/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ body, postId, userId: 1 }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add comment");
  return data as Comment;
};

export const createPostApi = async (
  payload: Partial<BlogPost> & { title: string; body: string },
  token: string,
) => {
  const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...payload,
      tags: payload.tags ?? ["news"],
      reactions: payload.reactions ?? { likes: 0, dislikes: 0 },
      userId: payload.userId ?? 1,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }

  return data as BlogPost;
};

export const updatePostApi = async (id: number, updates: Partial<BlogPost>, token: string) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update post");
  }

  return data as BlogPost;
};

export const deletePostApi = async (id: number, token: string) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }

  return id;
};
