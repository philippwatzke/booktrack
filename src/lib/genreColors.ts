// Genre color mappings for visual distinction
const GENRE_COLOR_MAP: Record<string, string> = {
  // Fantasy & Magic
  'fantasy': 'bg-purple-500/15 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300',
  'magic': 'bg-violet-500/15 text-violet-700 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300',
  'urban fantasy': 'bg-indigo-500/15 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300',

  // Sci-Fi & Technology
  'science fiction': 'bg-cyan-500/15 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300',
  'sci-fi': 'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300',
  'cyberpunk': 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300',
  'dystopian': 'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300',

  // Mystery & Thriller
  'mystery': 'bg-red-500/15 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300',
  'thriller': 'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300',
  'crime': 'bg-orange-500/15 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300',
  'detective': 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',

  // Romance & Relationships
  'romance': 'bg-pink-500/15 text-pink-700 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-300',
  'love': 'bg-fuchsia-500/15 text-fuchsia-700 border-fuchsia-500/30 dark:bg-fuchsia-500/20 dark:text-fuchsia-300',
  'contemporary romance': 'bg-rose-400/15 text-rose-600 border-rose-400/30 dark:bg-rose-400/20 dark:text-rose-200',

  // Horror & Dark
  'horror': 'bg-gray-700/15 text-gray-900 border-gray-700/30 dark:bg-gray-700/30 dark:text-gray-100',
  'dark fantasy': 'bg-purple-900/15 text-purple-950 border-purple-900/30 dark:bg-purple-900/30 dark:text-purple-100',
  'gothic': 'bg-zinc-600/15 text-zinc-900 border-zinc-600/30 dark:bg-zinc-600/30 dark:text-zinc-100',

  // Historical & Period
  'historical fiction': 'bg-amber-600/15 text-amber-800 border-amber-600/30 dark:bg-amber-600/20 dark:text-amber-200',
  'historical': 'bg-yellow-600/15 text-yellow-800 border-yellow-600/30 dark:bg-yellow-600/20 dark:text-yellow-200',
  'period': 'bg-orange-600/15 text-orange-800 border-orange-600/30 dark:bg-orange-600/20 dark:text-orange-200',

  // Adventure & Action
  'adventure': 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
  'action': 'bg-green-500/15 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-300',
  'epic': 'bg-teal-500/15 text-teal-700 border-teal-500/30 dark:bg-teal-500/20 dark:text-teal-300',

  // Young Adult & Coming of Age
  'young adult': 'bg-lime-500/15 text-lime-700 border-lime-500/30 dark:bg-lime-500/20 dark:text-lime-300',
  'ya': 'bg-lime-500/15 text-lime-700 border-lime-500/30 dark:bg-lime-500/20 dark:text-lime-300',
  'coming of age': 'bg-green-400/15 text-green-600 border-green-400/30 dark:bg-green-400/20 dark:text-green-200',

  // Literary & Contemporary
  'literary fiction': 'bg-stone-500/15 text-stone-700 border-stone-500/30 dark:bg-stone-500/20 dark:text-stone-300',
  'contemporary': 'bg-neutral-500/15 text-neutral-700 border-neutral-500/30 dark:bg-neutral-500/20 dark:text-neutral-300',
  'fiction': 'bg-gray-500/15 text-gray-700 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-300',

  // Non-Fiction & Educational
  'non-fiction': 'bg-blue-600/15 text-blue-800 border-blue-600/30 dark:bg-blue-600/20 dark:text-blue-200',
  'biography': 'bg-indigo-600/15 text-indigo-800 border-indigo-600/30 dark:bg-indigo-600/20 dark:text-indigo-200',
  'memoir': 'bg-violet-600/15 text-violet-800 border-violet-600/30 dark:bg-violet-600/20 dark:text-violet-200',
  'self-help': 'bg-sky-600/15 text-sky-800 border-sky-600/30 dark:bg-sky-600/20 dark:text-sky-200',
  'psychology': 'bg-cyan-600/15 text-cyan-800 border-cyan-600/30 dark:bg-cyan-600/20 dark:text-cyan-200',
  'philosophy': 'bg-teal-600/15 text-teal-800 border-teal-600/30 dark:bg-teal-600/20 dark:text-teal-200',
  'history': 'bg-amber-700/15 text-amber-900 border-amber-700/30 dark:bg-amber-700/20 dark:text-amber-100',
  'science': 'bg-blue-700/15 text-blue-900 border-blue-700/30 dark:bg-blue-700/20 dark:text-blue-100',
  'business': 'bg-emerald-600/15 text-emerald-800 border-emerald-600/30 dark:bg-emerald-600/20 dark:text-emerald-200',
  'technology': 'bg-cyan-700/15 text-cyan-900 border-cyan-700/30 dark:bg-cyan-700/20 dark:text-cyan-100',
};

// Default color for unknown genres
const DEFAULT_COLOR = 'bg-muted/50 text-muted-foreground border-muted';

/**
 * Get the tailwind color classes for a given genre
 * @param genre The genre name
 * @returns Tailwind CSS classes for the genre badge
 */
export function getGenreColor(genre: string): string {
  const normalizedGenre = genre.toLowerCase().trim();

  // Exact match
  if (GENRE_COLOR_MAP[normalizedGenre]) {
    return GENRE_COLOR_MAP[normalizedGenre];
  }

  // Partial match (e.g., "Historical Fiction" matches "historical")
  for (const [key, value] of Object.entries(GENRE_COLOR_MAP)) {
    if (normalizedGenre.includes(key) || key.includes(normalizedGenre)) {
      return value;
    }
  }

  return DEFAULT_COLOR;
}

/**
 * Get a consistent color for any genre (generates color from hash if not in map)
 * This ensures all genres get a color, even if not predefined
 */
export function getGenreColorConsistent(genre: string): string {
  const predefinedColor = getGenreColor(genre);
  if (predefinedColor !== DEFAULT_COLOR) {
    return predefinedColor;
  }

  // Generate a consistent color from the genre name hash
  const colors = [
    'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300',
    'bg-green-500/15 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-300',
    'bg-purple-500/15 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300',
    'bg-red-500/15 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300',
    'bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-300',
    'bg-pink-500/15 text-pink-700 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-300',
    'bg-indigo-500/15 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300',
    'bg-teal-500/15 text-teal-700 border-teal-500/30 dark:bg-teal-500/20 dark:text-teal-300',
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
