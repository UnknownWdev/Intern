"use client";

type SearchPostsProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchPosts({ query, onQueryChange, onSearch }: SearchPostsProps) {
  return (
    <div className="flex gap-2">
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search posts"
        className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
      />
      <button
        type="button"
        onClick={onSearch}
        className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
      >
        Search
      </button>
    </div>
  );
}
