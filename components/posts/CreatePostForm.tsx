"use client";

type CreatePostFormProps = {
  title: string;
  body: string;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSubmit: () => void;
};

export function CreatePostForm({
  title,
  body,
  onTitleChange,
  onBodyChange,
  onSubmit,
}: CreatePostFormProps) {
  return (
    <div className="space-y-3">
      <input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="Post title"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
      />
      <textarea
        value={body}
        onChange={(event) => onBodyChange(event.target.value)}
        placeholder="Write your blog post here..."
        rows={5}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
      />
      <button
        type="button"
        onClick={onSubmit}
        className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white"
      >
        Publish post
      </button>
    </div>
  );
}
