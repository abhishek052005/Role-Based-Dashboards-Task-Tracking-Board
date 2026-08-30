'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  accentColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-xs hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              trend.isNeutral
                ? 'bg-slate-800 text-slate-300'
                : trend.isPositive
                ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-400 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
