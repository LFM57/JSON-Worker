import React, { useCallback, useRef } from 'react';
import { FileWarningIcon } from './icons';

interface JsonInputProps {
  rawJson: string;
  setRawJson: (value: string) => void;
  onAnalyze: () => void;
  error: string | null;
}

export const JsonInput: React.FC<JsonInputProps> = ({ rawJson, setRawJson, onAnalyze, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        setRawJson(typeof text === 'string' ? text : '');
      };
      reader.readAsText(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  }, [setRawJson]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="json-input" className="block text-sm font-medium text-slate-300 mb-2">
            Paste your JSON here
          </label>
          <textarea
            id="json-input"
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder='[{"id": 1, "name": "Product A"}, ...]'
            className="w-full h-64 p-3 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 text-slate-200 resize-none font-mono text-sm"
            aria-label="JSON input"
            aria-invalid={!!error}
            aria-describedby={error ? "json-error" : undefined}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Instructions</h3>
            <ul className="list-disc list-inside mt-2 text-slate-400 space-y-1 text-sm">
                <li>Your JSON must be an array of objects.</li>
                <li>All objects in the array should have the same keys.</li>
                <li>Values should be simple types (string, number, boolean).</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button
              onClick={onAnalyze}
              className="w-full sm:w-auto flex-grow bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
            >
              Analyze JSON
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json,application/json"
              aria-label="Upload JSON file"
            />
            <button
              onClick={handleUploadClick}
              className="w-full sm:w-auto flex-grow bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
            >
              Upload a File
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div id="json-error" role="alert" className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md flex items-center gap-3">
          <FileWarningIcon className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </section>
  );
};
