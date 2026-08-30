'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Task } from '@/lib/types';

interface TaskCompletionChartProps {
  tasks: Task[];
  title?: string;
}

const COLORS = ['#334155', '#64748B', '#818CF8', '#4F46E5'];

export const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({
  tasks,
  title = 'Task Status Ratio',
}) => {
  const notStarted = tasks.filter((t) => t.status === 'NOT_STARTED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const underReview = tasks.filter((t) => t.status === 'UNDER_REVIEW').length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

  const data = [
    { name: 'Not Started', value: notStarted },
    { name: 'In Progress', value: inProgress },
    { name: 'Under Review', value: underReview },
    { name: 'Completed', value: completed },
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-base font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">Status ratio across active work items</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', border: '1px solid #334155', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
