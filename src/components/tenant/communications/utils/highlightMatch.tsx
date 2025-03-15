
import React from 'react';

/**
 * Highlights occurrences of a search term within text
 * @param text The text to search within
 * @param searchTerm The term to highlight
 * @returns JSX elements with highlighted portions wrapped in spans
 */
export const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? 
      <span key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded-sm font-medium">{part}</span> : 
      part
  );
};
