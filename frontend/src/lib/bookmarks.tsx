import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { addBookmark, getBookmarks as getBookmarksFromApi, removeBookmark } from "@/lib/api";

export const BOOKMARKS_UPDATED_EVENT = 'bookmarks-updated';
const LEGACY_BOOKMARKS_KEY = 'pn_bookmarks';

interface BookmarksContextValue {
  bookmarkedDealIds: string[];
  isLoading: boolean;
  error: string | null;
  isBookmarked: (dealId?: string | null) => boolean;
  isBookmarkPending: (dealId?: string | null) => boolean;
  toggleBookmark: (dealId: string) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
}

const fallbackBookmarksContext: BookmarksContextValue = {
  bookmarkedDealIds: [],
  isLoading: false,
  error: null,
  isBookmarked: () => false,
  isBookmarkPending: () => false,
  toggleBookmark: async () => {
    console.warn("toggleBookmark called without BookmarksProvider");
    return false;
  },
  refreshBookmarks: async () => {},
};

const BookmarksContext = createContext<BookmarksContextValue>(fallbackBookmarksContext);

const isUuid = (value?: string | null) =>
  !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const getBookmarkStorageKey = (userId: string) => `pn_bookmarks_${userId}`;

function readCachedBookmarks(userId?: string | null): string[] {
  if (!userId) return [];

  try {
    const scoped = JSON.parse(localStorage.getItem(getBookmarkStorageKey(userId)) || "[]");
    if (Array.isArray(scoped)) {
      return scoped.filter((dealId): dealId is string => typeof dealId === "string" && dealId.length > 0);
    }

    const legacy = JSON.parse(localStorage.getItem(LEGACY_BOOKMARKS_KEY) || '{"userId":"","dealIds":[]}');
    if (legacy?.userId === userId && Array.isArray(legacy.dealIds)) {
      return legacy.dealIds.filter((dealId: unknown): dealId is string => typeof dealId === "string" && dealId.length > 0);
    }
  } catch {
    return [];
  }

  return [];
}

function writeCachedBookmarks(userId?: string | null, dealIds: string[] = []) {
  if (!userId) return;

  const nextIds = Array.from(new Set(dealIds.filter((dealId) => typeof dealId === "string" && dealId.length > 0)));
  localStorage.setItem(getBookmarkStorageKey(userId), JSON.stringify(nextIds));
  localStorage.setItem(LEGACY_BOOKMARKS_KEY, JSON.stringify({ userId, dealIds: nextIds }));
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [bookmarkedDealIds, setBookmarkedDealIds] = useState<string[]>([]);
  const [pendingDealIds, setPendingDealIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBookmarks = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      setBookmarkedDealIds([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getBookmarksFromApi();
      const remoteIds = Array.isArray(response?.dealIds) ? response.dealIds : [];
      const cachedIds = readCachedBookmarks(user.id);
      const ids = Array.from(new Set([...cachedIds, ...remoteIds]));
      setBookmarkedDealIds(ids);
      writeCachedBookmarks(user.id, ids);
      setError(null);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      const cachedIds = readCachedBookmarks(user.id);
      setBookmarkedDealIds(cachedIds);
      setError(cachedIds.length > 0 ? null : "Failed to load saved deals");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  useEffect(() => {
    const handleBookmarksUpdated = () => {
      refreshBookmarks();
    };

    window.addEventListener(BOOKMARKS_UPDATED_EVENT, handleBookmarksUpdated);
    return () => window.removeEventListener(BOOKMARKS_UPDATED_EVENT, handleBookmarksUpdated);
  }, [refreshBookmarks]);

  const toggleBookmark = useCallback(async (dealId: string) => {
    if (!user?.id || !isAuthenticated) throw new Error("Authentication required");
    if (!dealId) throw new Error("Invalid deal ID");

    const wasBookmarked = bookmarkedDealIds.includes(dealId);
    const nextIds = wasBookmarked
      ? bookmarkedDealIds.filter(id => id !== dealId)
      : [dealId, ...bookmarkedDealIds.filter(id => id !== dealId)];

    setPendingDealIds(prev => prev.includes(dealId) ? prev : [...prev, dealId]);
    setBookmarkedDealIds(nextIds);
    writeCachedBookmarks(user.id, nextIds);

    try {
      if (isUuid(dealId)) {
        if (wasBookmarked) {
          await removeBookmark(dealId);
        } else {
          await addBookmark(dealId);
        }
      }

      const isSaved = !wasBookmarked;
      setError(null);
      window.dispatchEvent(new Event(BOOKMARKS_UPDATED_EVENT));
      return isSaved;
    } catch (err) {
      console.error("Failed to update bookmark:", err);
      const revertedIds = wasBookmarked
        ? [dealId, ...nextIds.filter(id => id !== dealId)]
        : nextIds.filter(id => id !== dealId);
      setBookmarkedDealIds(revertedIds);
      writeCachedBookmarks(user.id, revertedIds);
      setError("Failed to update saved deals");
      throw err;
    } finally {
      setPendingDealIds(prev => prev.filter(id => id !== dealId));
    }
  }, [bookmarkedDealIds, isAuthenticated, user?.id]);

  const value = useMemo<BookmarksContextValue>(() => ({
    bookmarkedDealIds,
    isLoading,
    error,
    isBookmarked: (dealId?: string | null) => !!dealId && bookmarkedDealIds.includes(dealId),
    isBookmarkPending: (dealId?: string | null) => !!dealId && pendingDealIds.includes(dealId),
    toggleBookmark,
    refreshBookmarks,
  }), [bookmarkedDealIds, error, isLoading, pendingDealIds, refreshBookmarks, toggleBookmark]);

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  return context;
}
