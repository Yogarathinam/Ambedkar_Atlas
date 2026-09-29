import React, { createContext, useContext, useState, useEffect } from 'react';
import { archiveService } from '../services/archiveService';
import { useToast } from './ToastContext';

interface BookmarkContextType {
  bookmarks: string[];
  toggleBookmark: (id: string, title?: string) => boolean;
  isBookmarked: (id: string) => boolean;
  bookmarksCount: number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    setBookmarks(archiveService.getBookmarks());
  }, []);

  const toggleBookmark = (id: string, title?: string) => {
    const isNowBookmarked = archiveService.toggleBookmark(id);
    setBookmarks(archiveService.getBookmarks());

    if (isNowBookmarked) {
      showToast(title ? `Saved "${title.substring(0, 32)}..." to Bookmarks` : 'Added to Bookmarks', 'success');
    } else {
      showToast('Removed from Bookmarks', 'info');
    }

    return isNowBookmarked;
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        isBookmarked,
        bookmarksCount: bookmarks.length,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
