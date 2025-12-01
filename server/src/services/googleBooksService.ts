import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY || '';

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    language?: string;
  };
}

interface BookSearchResult {
  googleBooksId: string;
  title: string;
  author: string;
  authors: string[];
  isbn?: string;
  isbn13?: string;
  pageCount?: number;
  publishedYear?: number;
  publisher?: string;
  description?: string;
  coverUrl?: string;
  genres?: string[];
  language?: string;
}

/**
 * Search for books using Google Books API
 */
export async function searchBooks(query: string, maxResults: number = 10): Promise<BookSearchResult[]> {
  try {
    const params: any = {
      q: query,
      maxResults,
      printType: 'books',
      langRestrict: 'de', // Prefer German books, but will also return others
    };

    if (API_KEY) {
      params.key = API_KEY;
    }

    const response = await axios.get<{ items?: GoogleBookVolume[] }>(GOOGLE_BOOKS_API_URL, {
      params,
      timeout: 10000, // 10 second timeout
    });

    if (!response.data.items || response.data.items.length === 0) {
      return [];
    }

    return response.data.items.map(transformGoogleBookToSearchResult).filter(Boolean) as BookSearchResult[];
  } catch (error: any) {
    console.error('Google Books API error:', error.message);

    // If it's a rate limit error, throw a specific error
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    throw new Error('Failed to search books. Please try again.');
  }
}

/**
 * Get a single book by Google Books ID
 */
export async function getBookById(googleBooksId: string): Promise<BookSearchResult | null> {
  try {
    const params: any = {};

    if (API_KEY) {
      params.key = API_KEY;
    }

    const response = await axios.get<GoogleBookVolume>(`${GOOGLE_BOOKS_API_URL}/${googleBooksId}`, {
      params,
      timeout: 10000,
    });

    return transformGoogleBookToSearchResult(response.data);
  } catch (error: any) {
    console.error('Google Books API error:', error.message);
    return null;
  }
}

/**
 * Transform Google Books API response to our standardized format
 */
function transformGoogleBookToSearchResult(volume: GoogleBookVolume): BookSearchResult | null {
  const info = volume.volumeInfo;

  if (!info.title) {
    return null; // Skip books without title
  }

  // Extract ISBNs
  let isbn: string | undefined;
  let isbn13: string | undefined;

  if (info.industryIdentifiers) {
    const isbn10 = info.industryIdentifiers.find(id => id.type === 'ISBN_10');
    const isbn13Obj = info.industryIdentifiers.find(id => id.type === 'ISBN_13');

    isbn = isbn10?.identifier;
    isbn13 = isbn13Obj?.identifier;
  }

  // Extract year from publishedDate
  let publishedYear: number | undefined;
  if (info.publishedDate) {
    const year = parseInt(info.publishedDate.substring(0, 4));
    if (!isNaN(year)) {
      publishedYear = year;
    }
  }

  // Get primary author and full authors list
  const authors = info.authors || ['Unbekannt'];
  const primaryAuthor = authors[0];

  // Get best cover image
  let coverUrl: string | undefined;
  if (info.imageLinks?.thumbnail) {
    // Remove edge curl and zoom parameters, get higher quality
    coverUrl = info.imageLinks.thumbnail
      .replace('&edge=curl', '')
      .replace('zoom=1', 'zoom=2');
  } else if (info.imageLinks?.smallThumbnail) {
    coverUrl = info.imageLinks.smallThumbnail;
  }

  // Get genres from categories
  const genres = info.categories?.slice(0, 3); // Limit to first 3 categories

  return {
    googleBooksId: volume.id,
    title: info.title,
    author: primaryAuthor,
    authors,
    isbn: isbn || isbn13, // Fallback to ISBN-13 if ISBN-10 not available
    isbn13,
    pageCount: info.pageCount,
    publishedYear,
    publisher: info.publisher,
    description: info.description,
    coverUrl,
    genres,
    language: info.language,
  };
}
