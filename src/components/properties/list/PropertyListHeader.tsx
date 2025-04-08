
import React from 'react';
import { SearchBar } from './SearchBar';
import { AddPropertyButton } from './AddPropertyButton';

interface PropertyListHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPropertyClick: () => void;
}

export function PropertyListHeader({ 
  searchQuery, 
  onSearchChange, 
  onAddPropertyClick 
}: PropertyListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={onSearchChange} 
      />
      
      <AddPropertyButton onClick={onAddPropertyClick} />
    </div>
  );
}
