'use client';

import React from 'react';
import { Receivable } from '@/lib/types';
import { IndianRupee, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ReceivablesWidgetProps {
  receivables: Receivable[];
}

export const ReceivablesWidget: React.FC<ReceivablesWidgetProps> = ({ receivables }) => {
  const totalAmount = receivables.reduce((sum, r) => sum + r.amount, 0);
  const totalPaid = receivables.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalOutstanding = totalAmount - totalPaid;
  const overdueCount = receivables.filter((r) => r.status === 'OVERDUE').length;

  return (
    <div className="bg-gray-900/90 rounded-2xl p-5 border border-gray-800 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              Receivables Register
            </h3>
            <p className="text-xs text-gray-400 font-medium">Client billing & outstanding collections</p>
          </div>
          {overdueCount > 0 && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {overdueCount} Overdue
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/60">
            <span className="text-[11px] font-medium text-gray-400">Total Outstanding</span>
            <div className="text-xl font-black text-white mt-1">
              ₹{(totalOutstanding / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <span className="text-[11px] font-medium text-emerald-400">Total Collected</span>
            <div className="text-xl font-black text-emerald-300 mt-1">
              ₹{(totalPaid / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {receivables.slice(0, 4).map((rec) => {
            const dueBalance = rec.amount - rec.paidAmount;
            return (
              <div
                key={rec.id}
                className="flex items-center justify-between p-2.5 bg-gray-800/40 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800"
              >
                <div>
                  <div className="text-xs font-bold text-white">{rec.clientName}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{rec.invoiceNumber} • Due: {rec.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-white">₹{dueBalance.toLocaleString('en-IN')}</div>
                  <span
                    className={`inline-block text-[10px] font-bold ${
                      rec.status === 'OVERDUE'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800 text-right">
        <button className="text-xs font-bold text-indigo-400 hover:underline inline-flex items-center gap-1">
          View full billing register <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
