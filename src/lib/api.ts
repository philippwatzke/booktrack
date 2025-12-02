// API Base URL
const API_BASE_URL = '/api';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Fetch wrapper with auth
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
  }

  return response;
}

// Auth API
export const authApi = {
  register: async (email: string, password: string, name?: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetchWithAuth('/auth/profile');
    return response.json();
  },
};

// Books API
export const booksApi = {
  getAll: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetchWithAuth(`/books${query ? `?${query}` : ''}`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetchWithAuth(`/books/${id}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/books/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  searchByIsbn: async (isbn: string) => {
    const response = await fetchWithAuth(`/books/isbn/${isbn}`);
    return response.json();
  },

  searchExternal: async (query: string) => {
    const response = await fetchWithAuth(`/books/search?query=${encodeURIComponent(query)}`);
    return response.json();
  },
};

// Reading Sessions API
export const readingSessionsApi = {
  getByBook: async (bookId: string) => {
    const response = await fetchWithAuth(`/reading-sessions/book/${bookId}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/reading-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/reading-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/reading-sessions/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  getStats: async (bookId: string) => {
    const response = await fetchWithAuth(`/reading-sessions/book/${bookId}/stats`);
    return response.json();
  },
};

// Quotes API
export const quotesApi = {
  getAll: async () => {
    const response = await fetchWithAuth('/quotes');
    return response.json();
  },

  getByBook: async (bookId: string) => {
    const response = await fetchWithAuth(`/quotes/book/${bookId}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/quotes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Notes API
export const notesApi = {
  getByBook: async (bookId: string) => {
    const response = await fetchWithAuth(`/notes/book/${bookId}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/notes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Streaks API
export const streaksApi = {
  get: async () => {
    const response = await fetchWithAuth('/streaks');
    return response.json();
  },

  getLogs: async (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetchWithAuth(`/streaks/logs${query ? `?${query}` : ''}`);
    return response.json();
  },

  useFreeze: async (date: string) => {
    const response = await fetchWithAuth('/streaks/freeze', {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
    return response.json();
  },
};

// Goals & Preferences API
export const goalsApi = {
  // Preferences
  getPreferences: async () => {
    const response = await fetchWithAuth('/goals/preferences');
    return response.json();
  },

  updatePreferences: async (data: any) => {
    const response = await fetchWithAuth('/goals/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Goals
  getAll: async () => {
    const response = await fetchWithAuth('/goals');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/goals/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Collections API
export const collectionsApi = {
  getAll: async (params?: { type?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetchWithAuth(`/collections${query ? `?${query}` : ''}`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetchWithAuth(`/collections/${id}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/collections/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  addBook: async (collectionId: string, data: any) => {
    const response = await fetchWithAuth(`/collections/${collectionId}/books`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  removeBook: async (collectionId: string, bookId: string) => {
    const response = await fetchWithAuth(`/collections/${collectionId}/books/${bookId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  updateBook: async (collectionId: string, bookId: string, data: any) => {
    const response = await fetchWithAuth(`/collections/${collectionId}/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Series API
export const seriesApi = {
  getAll: async () => {
    const response = await fetchWithAuth('/series');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetchWithAuth(`/series/${id}`);
    return response.json();
  },

  getUserSeries: async () => {
    const response = await fetchWithAuth('/series/user/my-series');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetchWithAuth('/series', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/series/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/series/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  addBook: async (seriesId: string, data: any) => {
    const response = await fetchWithAuth(`/series/${seriesId}/books`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  removeBook: async (seriesId: string, bookId: string) => {
    const response = await fetchWithAuth(`/series/${seriesId}/books/${bookId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  updateBook: async (seriesId: string, bookId: string, data: any) => {
    const response = await fetchWithAuth(`/series/${seriesId}/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
