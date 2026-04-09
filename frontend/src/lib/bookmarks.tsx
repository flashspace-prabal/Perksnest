import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { BOOKMARKS_UPDATED_EVENT, getBookmarkedDealIds, toggleBookmark as toggleBookmarkInStore } from "@/lib/store";

interface BookmarksContextValue {
  bookmarkedDealIds: string[];
  isLoading: boolean;
  error: string | null;
  isBookmarked: (dealId?: string | null) => boolean;
  isBookmarkPending: (dealId?: string | null) => boolean;
  toggleBookmark: (dealId: string) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

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
      const ids = await getBookmarkedDealIds(user.id);
      setBookmarkedDealIds(ids);
      setError(null);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      setError("Failed to load saved deals");
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
    setPendingDealIds(prev => prev.includes(dealId) ? prev : [...prev, dealId]);
    setBookmarkedDealIds(prev => (
      wasBookmarked ? prev.filter(id => id !== dealId) : [dealId, ...prev.filter(id => id !== dealId)]
    ));

    try {
      const isSaved = await toggleBookmarkInStore(user.id, dealId);
      setError(null);
      return isSaved;
    } catch (err) {
      console.error("Failed to update bookmark:", err);
      setBookmarkedDealIds(prev => (
        wasBookmarked ? [dealId, ...prev.filter(id => id !== dealId)] : prev.filter(id => id !== dealId)
      ));
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
  if (!context) throw new Error("useBookmarks must be used within BookmarksProvider");
  return context;
}
