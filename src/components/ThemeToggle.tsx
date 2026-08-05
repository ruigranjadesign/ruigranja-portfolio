import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode?: boolean;
  onToggleTheme?: () => void;
  title?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode: propDarkMode,
  onToggleTheme,
  title = 'Alternar tema (CRT TV)',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof propDarkMode === 'boolean') return propDarkMode;
    return typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false;
  });

  // Keep local dark mode state synchronized with prop changes
  useEffect(() => {
    if (typeof propDarkMode === 'boolean') {
      setIsDark(propDarkMode);
    } else if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [propDarkMode]);

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Midpoint of CRT TV Off animation (~200ms): flip .dark class on documentElement
    setTimeout(() => {
      const html = document.documentElement;
      const nextDark = !html.classList.contains('dark');

      if (nextDark) {
        html.classList.add('dark');
        html.classList.remove('light');
        localStorage.setItem('minimal_cv_theme', 'dark');
      } else {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('minimal_cv_theme', 'light');
      }

      setIsDark(nextDark);

      if (onToggleTheme) {
        onToggleTheme();
      }
    }, 200);

    // End of animation (~400ms): deactivate overlay
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        id="theme-toggle"
        disabled={isAnimating}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
        title={title}
        aria-label={title}
      >
        {isDark ? (
          <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-500 dark:text-[#CCFF00] transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 md:w-5 md:h-5 text-zinc-700 transition-transform duration-200 hover:-rotate-12" />
        )}
      </button>

      {/* Fullscreen CRT TV Shutdown Overlay */}
      {isAnimating &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 pointer-events-none bg-zinc-950/90 dark:bg-zinc-100/90 backdrop-blur-sm animate-tv-off flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            {/* CRT Horizontal Phosphor Bright Flash Line */}
            <div className="w-full h-[2px] bg-white shadow-[0_0_20px_#ffffff,0_0_40px_#CCFF00,0_0_80px_#ffffff]" />
          </div>,
          document.body
        )}
    </>
  );
};
