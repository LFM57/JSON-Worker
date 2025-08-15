import React from 'react';
import { JsonObject, SortOrder } from '../types';
import { SortAscIcon, SortDescIcon, SortableIcon } from './icons';

interface DataTableProps {
  headers: string[];
  data: JsonObject[];
  sortKey: string;
  sortOrder: SortOrder;
  onSort: (key: string) => void;
}

const renderValue = (value: any) => {
    if (value === null || value === undefined) {
        return <span className="text-slate-500">N/A</span>;
    }
    if (typeof value === 'boolean') {
        return <span className={`font-medium ${value ? 'text-green-400' : 'text-red-400'}`}>{value ? 'true' : 'false'}</span>;
    }
    return String(value);
}

export const DataTable: React.FC<DataTableProps> = ({ headers, data, sortKey, sortOrder, onSort }) => {
  if (data.length === 0) {
    return (
        <div className="text-center p-8 bg-slate-900/50 rounded-lg">
            <p className="text-slate-400">No results match your search criteria.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-cyan-300 uppercase bg-slate-700">
          <tr>
            {headers.map(header => (
              <th key={header} scope="col" className="px-6 py-3">
                <button
                  className="flex items-center gap-2 w-full text-left transition-colors hover:text-cyan-200"
                  onClick={() => onSort(header)}
                  aria-label={`Sort by ${header}`}
                >
                  <span>{header}</span>
                  {sortKey === header ? (
                    sortOrder === 'asc' ? <SortAscIcon className="w-4 h-4 flex-shrink-0" /> :
                    sortOrder === 'desc' ? <SortDescIcon className="w-4 h-4 flex-shrink-0" /> :
                    <SortableIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  ) : (
                    <SortableIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150">
              {headers.map(header => (
                <td key={`${header}-${index}`} className="px-6 py-4 whitespace-nowrap">
                  {renderValue(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
