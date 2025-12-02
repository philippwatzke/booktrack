// Helper functions for SQLite JSON fields

export const serializeArray = (arr?: string[]): string | null => {
  if (!arr || arr.length === 0) return null;
  return JSON.stringify(arr);
};

export const deserializeArray = (str?: string | null): string[] => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
};

export const transformBookFromDb = (book: any) => {
  // Fix HTTP cover URLs to HTTPS to avoid mixed content issues
  let coverUrl = book.coverUrl;
  if (coverUrl && coverUrl.startsWith('http://')) {
    coverUrl = coverUrl.replace('http://', 'https://');
  }

  return {
    ...book,
    coverUrl,
    genres: deserializeArray(book.genres),
    tags: deserializeArray(book.tags),
  };
};

export const transformBookForDb = (book: any) => {
  return {
    ...book,
    genres: serializeArray(book.genres),
    tags: serializeArray(book.tags),
  };
};
