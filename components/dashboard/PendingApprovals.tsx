'use client';

import React from 'react';
import { PendingApproval, User } from '@/lib/types';
import { Check, X, FileCheck, Clock } from 'lucide-react';
import { DataService } from '@/lib/data/service';

interface PendingApprovalsProps {
  approvals: PendingApproval[];
  currentUser: User;
  onActionComplete: () => void;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  approvals,
  currentUser,
  onActionComplete,
}) => {
  const pendingItems = approvals.filter((a) => a.status === 'PENDING');

  const handleAction = async (id: string, approved: boolean) => {
    try {
      await DataService.processApproval(currentUser, id, approved);
      onActionComplete();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="bg-gray-900/90 rounded-2xl p-5 border border-gray-800 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              Pending Approvals
            </h3>
            <p className="text-xs text-gray-400 font-medium">Leave & attendance regularization requests</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {pendingItems.length} Pending
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {pendingItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">No pending approvals</div>
          ) : (
            pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-800/40 rounded-xl border border-gray-800 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{item.employeeName}</span>
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {item.startDate}
                  </span>
                </div>

                <p className="text-xs text-gray-300 italic">{item.reason}</p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => handleAction(item.id, false)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(item.id, true)}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
