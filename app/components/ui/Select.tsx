'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { TMDB_GENRES } from '@/app/utils/genres';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
}

export function Select({ value, onValueChange, items }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value === 'all' 
    ? 'All Genres' 
    : items.find(item => item.value === value)?.label || 'All Genres';

  return (
    <div className="relative" ref={selectRef}>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 rounded-lg shadow-lg z-10">
          {items.map((item) => (
            <button
              key={item.value}
              className={`w-full px-4 py-2 text-left hover:bg-white/20 transition ${
                value === item.value ? 'bg-white/20' : ''
              }`}
              onClick={() => {
                onValueChange(item.value);
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  return <div className="py-1">{children}</div>;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  return (
    <button
      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
      onClick={() => {
        const event = new CustomEvent('select-item', { detail: value });
        document.dispatchEvent(event);
      }}
    >
      {children}
    </button>
  );
}

interface SelectTriggerProps {
  children: React.ReactNode;
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  return <>{children}</>;
}

interface SelectValueProps {
  children: React.ReactNode;
}

export function SelectValue({ children }: SelectValueProps) {
  return <>{children}</>;
} 