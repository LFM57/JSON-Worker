import React from 'react';

interface ControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalItems: number;
  filteredItems: number;
}

export const Controls: React.FC<ControlsProps> = ({
  searchTerm,
  setSearchTerm,
  totalItems,
  filteredItems,
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:flex-grow">
        <input
          type="text"
          placeholder="Search all columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-4 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
          aria-label="Search data"
        />
      </div>
      <div className="text-sm text-slate-400 w-full md:w-auto text-center md:text-right flex-shrink-0">
        Showing <strong>{filteredItems}</strong> of <strong>{totalItems}</strong> entries
      </div>
    </div>
  );
};
