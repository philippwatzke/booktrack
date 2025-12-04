import { useEffect } from 'react';

interface PageTitleOptions {
  title: string;
  progress?: number; // 0-100
  showProgress?: boolean;
}

/**
 * Custom hook to set the page title with optional progress indicator
 *
 * @param options - Page title configuration
 * @example
 * usePageTitle({ title: "The Hobbit", progress: 47, showProgress: true })
 * // Sets title to: "[47%] The Hobbit - BookTrack"
 */
export function usePageTitle({ title, progress, showProgress = false }: PageTitleOptions) {
  useEffect(() => {
    const baseTitle = "BookTrack";

    let fullTitle = title;

    // Add progress indicator if enabled and progress is provided
    if (showProgress && progress !== undefined && progress >= 0 && progress <= 100) {
      const progressBar = generateProgressBar(progress);
      fullTitle = `${progressBar} ${title}`;
    }

    // Add base title
    document.title = fullTitle ? `${fullTitle} - ${baseTitle}` : baseTitle;

    // Cleanup: Reset to base title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title, progress, showProgress]);
}

/**
 * Generates a visual progress bar using Unicode block characters
 * @param progress - Progress percentage (0-100)
 * @returns String representation of progress bar
 */
function generateProgressBar(progress: number): string {
  const percentage = Math.round(Math.max(0, Math.min(100, progress)));

  // Option 1: Percentage with brackets
  return `[${percentage}%]`;

  // Option 2: Block-based progress bar (uncomment to use)
  // const blocks = 10;
  // const filled = Math.round((percentage / 100) * blocks);
  // const empty = blocks - filled;
  // const bar = '█'.repeat(filled) + '░'.repeat(empty);
  // return `[${bar}]`;
}

/**
 * Hook to set a simple page title without progress
 * @param title - Page title
 */
export function useSimplePageTitle(title: string) {
  usePageTitle({ title, showProgress: false });
}
