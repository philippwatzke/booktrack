import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutOptions {
  onSearch?: () => void;
  onNewBook?: () => void;
  onHome?: () => void;
}

/**
 * Global keyboard shortcuts hook
 *
 * Shortcuts:
 * - / or Ctrl+K: Open search/library
 * - Ctrl+N: Open new book dialog
 * - Ctrl+H: Go to home/dashboard
 * - Esc: Close dialogs (handled by shadcn/ui components)
 */
export function useKeyboardShortcuts(options: KeyboardShortcutOptions = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Ctrl+K or / - Open search/library
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !isInputField)) {
        e.preventDefault();
        if (options.onSearch) {
          options.onSearch();
        } else {
          navigate('/library');
        }
        return;
      }

      // Ctrl+N - New book
      if (e.ctrlKey && e.key === 'n' && !isInputField) {
        e.preventDefault();
        if (options.onNewBook) {
          options.onNewBook();
        }
        return;
      }

      // Ctrl+H - Home/Dashboard
      if (e.ctrlKey && e.key === 'h' && !isInputField) {
        e.preventDefault();
        if (options.onHome) {
          options.onHome();
        } else {
          navigate('/');
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, options]);
}
