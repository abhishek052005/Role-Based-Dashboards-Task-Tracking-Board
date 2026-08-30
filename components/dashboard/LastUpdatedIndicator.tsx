'use client';

import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface LastUpdatedIndicatorProps {
  lastUpdated: string;
  isRefreshing: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const LastUpdatedIndicator: React.FC<LastUpdatedIndicatorProps> = ({
  lastUpdated,
  isRefreshing,
  error,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {error && (
        <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>Unable to refresh live data. Showing last known values.</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-gray-300 text-xs bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-700/80 shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-gray-300">Last updated:</span> <span className="font-mono text-white font-bold">{lastUpdated}</span>
        </span>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
          className="hover:text-white transition-colors p-0.5 rounded-md hover:bg-gray-700 disabled:opacity-50"
          aria-label="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-gray-400'}`} />
        </button>
      </div>
    </div>
  );
};
