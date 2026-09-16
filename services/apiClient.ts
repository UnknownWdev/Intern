import axios from "axios";

const AUTH_STORAGE_KEY = "dummyjson-auth";

export const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return config;
    }

    const parsed = JSON.parse(raw) as { token?: string | null };
    const token = parsed.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore malformed stored auth and continue without a token.
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    return Promise.reject(error);
  },
);
