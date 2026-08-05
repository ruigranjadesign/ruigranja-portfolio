import React from 'react';
import { Sun, Moon } from 'lucide-react';
export { ThemeToggle } from './ThemeToggle';

interface ThemeToggleIconProps {
  darkMode: boolean;
}

export const ThemeToggleIcon: React.FC<ThemeToggleIconProps> = ({ darkMode }) => {
  return darkMode ? (
    <Sun className="w-4 h-4 md:w-5 md:h-5 text-[#CCFF00]" />
  ) : (
    <Moon className="w-4 h-4 md:w-5 md:h-5 text-zinc-700" />
  );
};
