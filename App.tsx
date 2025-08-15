import React, { useState, useMemo, useCallback } from 'react';
import { JsonInput } from './components/JsonInput';
import { Controls } from './components/Controls';
import { DataTable } from './components/DataTable';
import { JsonObject, SortOrder } from './types';
import { TableIcon } from './components/icons';

const App: React.FC = () => {
  const [rawJson, setRawJson] = useState<string>('');
  const [data, setData] = useState<JsonObject[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [headers, setHeaders] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleAnalyze = useCallback(() => {
    if (!rawJson.trim()) {
      setError("Input is empty. Please paste or upload a JSON document.");
      setData(null);
      setHeaders([]);
      return;
    }

    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid JSON structure: The root element must be an array of objects.");
      }
      if (parsed.length === 0) {
        throw new Error("The JSON array is empty.");
      }
      const firstItem = parsed[0];
      if (typeof firstItem !== 'object' || firstItem === null || Array.isArray(firstItem)) {
         throw new Error("Invalid JSON structure: The array must contain objects.");
      }
      
      const firstItemKeys = Object.keys(firstItem);
      if (firstItemKeys.length === 0) {
        throw new Error("Objects in the JSON array have no properties.");
      }

      setData(parsed);
      setHeaders(firstItemKeys);
      setSortKey(firstItemKeys[0] || '');
      setSortOrder('none');
      setSearchTerm('');
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Parsing Error: ${e.message}`);
      } else {
        setError("An unknown error occurred during parsing.");
      }
      setData(null);
      setHeaders([]);
    }
  }, [rawJson]);

  const displayedData = useMemo(() => {
    if (!data) return [];

    let filteredData = [...data];

    // Search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(lowercasedFilter)
        )
      );
    }

    // Sort
    if (sortOrder !== 'none' && sortKey) {
      filteredData.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === null || valA === undefined) return sortOrder === 'asc' ? -1 : 1;
        if (valB === null || valB === undefined) return sortOrder === 'asc' ? 1 : -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (strA > strB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortKey, sortOrder]);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortOrder(current => {
        if (current === 'asc') return 'desc';
        if (current === 'desc') return 'none';
        return 'asc';
      });
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }, [sortKey]);

  return (
    <main className="container mx-auto p-4 md:p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">JSON Data Analyzer</h1>
        <p className="text-slate-400 text-lg">Paste, upload, and interact with your JSON data instantly.</p>
      </header>

      <JsonInput 
        rawJson={rawJson} 
        setRawJson={setRawJson} 
        onAnalyze={handleAnalyze}
        error={error}
      />

      {data ? (
        <div className="mt-8 bg-slate-800 p-6 rounded-lg shadow-lg">
          <Controls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalItems={data.length}
            filteredItems={displayedData.length}
          />
          <DataTable 
            headers={headers}
            data={displayedData}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      ) : (
        !error && (
            <div className="mt-8 text-center bg-slate-800 p-12 rounded-lg shadow-lg border-2 border-dashed border-slate-700">
                <TableIcon className="w-16 h-16 mx-auto text-slate-600" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-300">Your Data Table Will Appear Here</h2>
                <p className="text-slate-500 mt-2">
                    Once you analyze a valid JSON array of objects, you'll see it beautifully formatted and ready for exploration.
                </p>
            </div>
        )
      )}
    </main>
  );
};

export default App;
