const CACHE_PREFIX = "mindful-notes-cache";
const CACHE_EXPIRY_MS = 60 * 60 * 1000;

export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${CACHE_PREFIX}:${key}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(`${CACHE_PREFIX}:${key}`);
      return null;
    }

    return parsed.value;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + CACHE_EXPIRY_MS,
    };

    window.localStorage.setItem(`${CACHE_PREFIX}:${key}`, JSON.stringify(entry));
  } catch {
    // Ignore cache write failures in restricted browser storage scenarios.
  }
}

export function clearCache(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(`${CACHE_PREFIX}:${key}`);
}
