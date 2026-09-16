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

export type AuthCredentials = {
  username: string;
  password: string;
};

export const loginUserApi = async ({ username, password }: AuthCredentials) => {
  const loginResponse = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });

  const loginData = await loginResponse.json();

  if (!loginResponse.ok || loginData.message) {
    throw new Error(loginData.message || "Login failed");
  }

  const token = loginData.accessToken ?? loginData.token;

  if (!token) {
    throw new Error("Login response did not include an access token");
  }

  const meResponse = await fetch("https://dummyjson.com/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const meData = await meResponse.json();

  if (!meResponse.ok || meData.message) {
    throw new Error(meData.message || "Unable to get current user");
  }

  return {
    token,
    user: {
      ...meData,
      username: meData.username || username,
    } as User,
  };
};

export const fetchPostsApi = async () => {
  const response = await fetch("https://dummyjson.com/posts");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data.posts ?? [] as BlogPost[];
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

export const createPostApi = async (
  payload: Partial<BlogPost> & { title: string; body: string },
) => {
  const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export const updatePostApi = async (id: number, updates: Partial<BlogPost>) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update post");
  }

  return data as BlogPost;
};

export const deletePostApi = async (id: number) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }

  return id;
};
