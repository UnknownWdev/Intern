"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { PostCard } from "@/components/posts/PostCard";
import { SearchPosts } from "@/components/posts/SearchPosts";
import { Pagination } from "@/components/common/Pagination";
import { showToast } from "@/components/common/ToastProvider";
import { loginUser, logout } from "@/store/features/auth/authSlice";
import {
  createPost,
  deletePost,
  fetchPosts,
  searchPosts,
  updatePost,
} from "@/store/features/posts/postsSlice";
import type { RootState } from "@/store/store";

export default function Home() {
  const dispatch = useDispatch();
  const { user, token, loading: authLoading, error: authError } = useSelector(
    (state: RootState) => state.auth,
  );
  const { posts, loading: postsLoading, error: postsError, total, page, limit } = useSelector(
    (state: RootState) => state.posts,
  );

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loginValidationError, setLoginValidationError] = useState<string | null>(null);
  const [postValidationError, setPostValidationError] = useState<string | null>(null);
  const [searchValidationError, setSearchValidationError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPosts() as never);
  }, [dispatch]);

  const handleRetryLoad = () => {
    setSearchValidationError(null);
    dispatch(fetchPosts() as never);
  };

  const handlePageChange = (nextPage: number) => {
    dispatch(fetchPosts({ page: nextPage, limit }) as never);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setLoginValidationError("Please enter both your username and password.");
      showToast("Please enter both your username and password.", "error");
      return;
    }

    setLoginValidationError(null);
    dispatch(loginUser({ username: trimmedUsername, password: trimmedPassword }) as never);
    showToast("Signing in...", "info");
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchValidationError(null);
      dispatch(fetchPosts() as never);
      showToast("Showing all posts", "info");
      return;
    }

    if (trimmedQuery.length < 2) {
      setSearchValidationError("Search query must be at least 2 characters long.");
      showToast("Search query must be at least 2 characters long.", "error");
      return;
    }

    setSearchValidationError(null);
    dispatch(searchPosts(trimmedQuery) as never);
    showToast(`Searching for "${trimmedQuery}"`, "info");
  };

  const handleCreatePost = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setPostValidationError("Title and body are required before publishing.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setPostValidationError("Please enter a title with at least 3 characters.");
      return;
    }

    if (trimmedBody.length < 10) {
      setPostValidationError("Post content should be at least 10 characters long.");
      return;
    }

    setPostValidationError(null);
    dispatch(
      createPost({
        title: trimmedTitle,
        body: trimmedBody,
        userId: user?.id ?? 1,
        tags: ["blog", "redux"],
        reactions: { likes: 0, dislikes: 0 },
      }) as never,
    );
    showToast("Post created successfully", "success");

    setTitle("");
    setBody("");
  };

  const handleDeletePost = (id: number) => {
    dispatch(deletePost(id) as never);
    showToast("Post deleted", "success");
  };

  const handleUpdatePost = (id: number) => {
    dispatch(
      updatePost({
        id,
        updates: {
          title: "Updated via DummyJSON",
          body: "This post was updated using the DummyJSON API update endpoint.",
        },
      }) as never,
    );
    showToast("Post updated", "success");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                DummyJSON Blog
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl dark:text-slate-100">Redux-powered posts</h1>
            </div>

            {token && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <LoginPanel
                username={username}
                password={password}
                loading={authLoading}
                error={loginValidationError || authError}
                onUsernameChange={setUsername}
                onPasswordChange={setPassword}
                onSubmit={handleLogin}
              />
            )}
          </div>
        </header>

        {token && user && (
          <section className="mb-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Create a new post</h2>
              <CreatePostForm
                title={title}
                body={body}
                onTitleChange={setTitle}
                onBodyChange={setBody}
                onSubmit={handleCreatePost}
              />
              {postValidationError && (
                <p className="mt-3 text-sm text-red-600">{postValidationError}</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Search posts</h2>
              <SearchPosts
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
              />
              {searchValidationError && (
                <p className="mt-3 text-sm text-red-600">{searchValidationError}</p>
              )}
            </div>
          </section>
        )}

        {postsLoading && (
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300" />
            Loading posts...
          </div>
        )}

        {!postsLoading && postsError && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-medium">We couldn’t load the blog right now.</p>
            <p className="mt-1">{postsError}</p>
            <button
              type="button"
              onClick={handleRetryLoad}
              className="mt-3 rounded-full bg-amber-700 px-4 py-2 text-xs font-medium text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!postsLoading && !postsError && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-100">No posts found.</p>
            <p className="mt-2">Try a different search or publish a new post.</p>
          </div>
        )}

        {!postsLoading && !postsError && posts.length > 0 && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isAuthenticated={Boolean(token && user)}
                onUpdate={handleUpdatePost}
                onDelete={handleDeletePost}
              />
            ))}
          </section>
        )}

        {!postsLoading && !postsError && posts.length > 0 && (
          <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={handlePageChange} />
        )}
      </div>
    </main>
  );
}
