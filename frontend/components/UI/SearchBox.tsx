import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Building } from '@/lib/types';

interface SearchBoxProps {
  buildings: Building[];
  onSearch: (query: string) => void;
  onSelectResult: (building: Building) => void;
}

export default function SearchBox({ buildings, onSearch, onSelectResult }: SearchBoxProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Building[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter suggestions when value changes
  useEffect(() => {
    onSearch(value); // Propagate to parent for list filtering
    
    if (value.trim().length > 0) {
      const lowerQuery = value.toLowerCase();
      const matched = buildings.filter(b => 
        b.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(matched);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, buildings, onSearch]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (building: Building) => {
    setValue(building.name);
    onSelectResult(building);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setValue('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative mb-4 z-50">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 sm:text-sm shadow-sm"
        placeholder="Search buildings..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
            if(value.trim().length > 0) setShowSuggestions(true);
        }}
      />
      {value && (
        <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
            <X className="h-4 w-4" />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((building) => (
            <li
              key={building.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 text-gray-900"
              onClick={() => handleSelect(building)}
            >
              <div className="flex items-center">
                <span className="font-medium block truncate">
                  {building.name}
                </span>
                <span className="ml-2 truncate text-gray-500 text-xs">
                    {building.category?.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
