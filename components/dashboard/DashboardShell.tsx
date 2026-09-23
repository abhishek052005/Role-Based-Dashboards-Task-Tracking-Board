'use client';

import React, { useState } from 'react';
import { User, Role } from '@/lib/types';
import { MOCK_USERS } from '@/lib/data/mockData';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarCheck,
  Shield,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { LastUpdatedIndicator } from './LastUpdatedIndicator';
import { ExportMenu } from './ExportMenu';

interface DashboardShellProps {
  currentUser: User;
  onRoleSwitch: (newUser: User) => void;
  activeTab: 'dashboard' | 'tasks' | 'attendance';
  onTabChange: (tab: 'dashboard' | 'tasks' | 'attendance') => void;
  lastUpdated: string;
  isRefreshing: boolean;
  error?: string | null;
  onRefresh: () => void;
  tasks: any[];
  attendance: any[];
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  currentUser,
  onRoleSwitch,
  activeTab,
  onTabChange,
  lastUpdated,
  isRefreshing,
  error,
  onRefresh,
  tasks,
  attendance,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleMeta: Record<Role, { label: string; badge: string }> = {
    PARTNER_ADMIN: { label: 'Partner / Admin', badge: 'bg-slate-800 text-slate-200 border border-slate-700' },
    HR_MANAGER: { label: 'HR / Office Manager', badge: 'bg-slate-800 text-slate-200 border border-slate-700' },
    TEAM_LEAD: { label: 'CA / Team Lead', badge: 'bg-slate-800 text-slate-200 border border-slate-700' },
    EMPLOYEE: { label: 'Employee / Intern', badge: 'bg-slate-800 text-slate-200 border border-slate-700' },
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-black/90 border-b border-neutral-800 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black font-extrabold text-sm shadow-lg shadow-white/10">
                RMH
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white leading-none">
                  RMH CRM & Workforce Platform
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                  Role-Based Dashboards & Task Tracking
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <LastUpdatedIndicator
              lastUpdated={lastUpdated}
              isRefreshing={isRefreshing}
              error={error}
              onRefresh={onRefresh}
            />

            <ExportMenu tasks={tasks} attendance={attendance} currentUser={currentUser} />

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-700 text-white"
              >
                  <Shield className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline text-slate-400">Role:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${roleMeta[currentUser.role].badge}`}>
                  {roleMeta[currentUser.role].label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-2xl bg-slate-900 border border-slate-800 text-white z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Simulation
                    </p>
                    <p className="text-xs text-slate-300">
                      Test RBAC access permissions & data scoping
                    </p>
                  </div>
                  {MOCK_USERS.slice(0, 5).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onRoleSwitch(u);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-slate-800 font-bold text-white border border-slate-700'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.department}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${roleMeta[u.role].badge}`}>
                        {u.role.split('_')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#101010]/95 border-r border-neutral-800 p-4 transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6 pt-16 lg:pt-0">
            {/* User Profile Badge */}
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {currentUser.email}
                </div>
                <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded ${roleMeta[currentUser.role].badge}`}>
                  {roleMeta[currentUser.role].label}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <button
                onClick={() => {
                  onTabChange('dashboard');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('tasks');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Task Tracking Board</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('attendance');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'attendance'
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Attendance Register</span>
              </button>
            </nav>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden max-w-[calc(100%-0px)]">{children}</main>
      </div>
    </div>
  );
};
