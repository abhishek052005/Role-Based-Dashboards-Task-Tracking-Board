import { User, Client, Task, AttendanceRecord, Receivable, PendingApproval } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_partner',
    name: 'Rajesh Sharma (Partner)',
    email: 'rajesh.sharma@rmhadvisors.com',
    role: 'PARTNER_ADMIN',
    department: 'Executive Management',
    teamId: 'team_tax',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr_hr',
    name: 'Priya Verma (HR Manager)',
    email: 'priya.verma@rmhadvisors.com',
    role: 'HR_MANAGER',
    department: 'Human Resources & Office Ops',
    teamId: 'team_hr',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'usr_tl_tax',
    name: 'Vikram Mehta (CA / Team Lead)',
    email: 'vikram.mehta@rmhadvisors.com',
    role: 'TEAM_LEAD',
    department: 'Taxation & Statutory Audit',
    teamId: 'team_tax',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr_tl_comp',
    name: 'Ananya Roy (CA / Team Lead)',
    email: 'ananya.roy@rmhadvisors.com',
    role: 'TEAM_LEAD',
    department: 'Corporate Compliance & ROC',
    teamId: 'team_comp',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    id: 'usr_emp1',
    name: 'Rahul Gupta',
    email: 'rahul.gupta@rmhadvisors.com',
    role: 'EMPLOYEE',
    department: 'Taxation & Statutory Audit',
    teamId: 'team_tax',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr_emp2',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@rmhadvisors.com',
    role: 'EMPLOYEE',
    department: 'Taxation & Statutory Audit',
    teamId: 'team_tax',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'usr_emp3',
    name: 'Siddharth Patel',
    email: 'siddharth.patel@rmhadvisors.com',
    role: 'EMPLOYEE',
    department: 'Corporate Compliance & ROC',
    teamId: 'team_comp',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: 'usr_emp4',
    name: 'Sneha Rao',
    email: 'sneha.rao@rmhadvisors.com',
    role: 'EMPLOYEE',
    department: 'Corporate Compliance & ROC',
    teamId: 'team_comp',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: 'usr_intern1',
    name: 'Aarav Joshi (Articled Assistant)',
    email: 'aarav.joshi@rmhadvisors.com',
    role: 'EMPLOYEE',
    department: 'Taxation & Statutory Audit',
    teamId: 'team_tax',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  },
  {
    id: 'usr_intern2',
    name: 'Kavya Nair (Articled Assistant)',
    email: 'kavya.nair@rmhadvisors.com',
    role: 'EMPLOYEE',
    department: 'Corporate Compliance & ROC',
    teamId: 'team_comp',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'cli_abc',
    name: 'ABC Private Limited',
    companyName: 'ABC Pvt Ltd',
    email: 'finance@abc-pvt.com',
    phone: '+91 98200 12345',
  },
  {
    id: 'cli_global',
    name: 'Global Tech Solutions LLP',
    companyName: 'Global Tech Solutions',
    email: 'accounts@globaltech.io',
    phone: '+91 98111 67890',
  },
  {
    id: 'cli_sun',
    name: 'Sun Pharma Dealers Ltd',
    companyName: 'Sun Pharma Dealers',
    email: 'tax@sunpharmadealers.com',
    phone: '+91 97654 32109',
  },
  {
    id: 'cli_acme',
    name: 'Acme Logistics India',
    companyName: 'Acme Logistics',
    email: 'billing@acmelogistics.in',
    phone: '+91 99000 54321',
  },
  {
    id: 'cli_zenith',
    name: 'Zenith Real Estate Pvt Ltd',
    companyName: 'Zenith Real Estate',
    email: 'finance@zenithreal.com',
    phone: '+91 98765 43210',
  },
  {
    id: 'cli_nexus',
    name: 'Nexus Foods & Beverages',
    companyName: 'Nexus Foods',
    email: 'compliance@nexusfoods.com',
    phone: '+91 91234 56789',
  },
];

// Helper to get dates relative to today
const getOffsetDate = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export const MOCK_TASKS: Task[] = [
  {
    id: 'tsk_101',
    title: 'GSTR-3B Monthly Filing - July 2026',
    description: 'Reconcile ITC from GSTR-2B, calculate GST liability and file GSTR-3B before deadline.',
    clientId: 'cli_abc',
    clientName: 'ABC Pvt Ltd',
    assigneeId: 'usr_emp1',
    assigneeName: 'Rahul Gupta',
    teamId: 'team_tax',
    dueDate: getOffsetDate(-2), // OVERDUE
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    createdAt: getOffsetDate(-10),
    updatedAt: getOffsetDate(-1),
    estimatedHours: 8,
  },
  {
    id: 'tsk_102',
    title: 'Statutory Audit Field Verification & Sampling',
    description: 'Verify fixed asset register and inventory valuation samples at client site.',
    clientId: 'cli_global',
    clientName: 'Global Tech Solutions',
    assigneeId: 'usr_emp1',
    assigneeName: 'Rahul Gupta',
    teamId: 'team_tax',
    dueDate: getOffsetDate(0), // DUE TODAY
    priority: 'HIGH',
    status: 'NOT_STARTED',
    createdAt: getOffsetDate(-5),
    updatedAt: getOffsetDate(-2),
    estimatedHours: 12,
  },
  {
    id: 'tsk_103',
    title: 'TDS Return Filing Q1 (Form 26Q)',
    description: 'Prepare quarterly TDS return data and validate challans against TRACES portal.',
    clientId: 'cli_sun',
    clientName: 'Sun Pharma Dealers',
    assigneeId: 'usr_emp2',
    assigneeName: 'Neha Kapoor',
    teamId: 'team_tax',
    dueDate: getOffsetDate(1), // DUE SOON
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    createdAt: getOffsetDate(-7),
    updatedAt: getOffsetDate(0),
    estimatedHours: 6,
  },
  {
    id: 'tsk_104',
    title: 'ROC Annual Return Filing (AOC-4 & MGT-7)',
    description: 'Prepare financial statement disclosures and board report annexures for ROC filing.',
    clientId: 'cli_acme',
    clientName: 'Acme Logistics',
    assigneeId: 'usr_emp3',
    assigneeName: 'Siddharth Patel',
    teamId: 'team_comp',
    dueDate: getOffsetDate(2), // DUE SOON
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: getOffsetDate(-8),
    updatedAt: getOffsetDate(0),
    estimatedHours: 10,
  },
  {
    id: 'tsk_105',
    title: 'Income Tax Return (ITR-6) Assessment Review',
    description: 'Draft response to Section 143(1) notice issued by IT Department.',
    clientId: 'cli_zenith',
    clientName: 'Zenith Real Estate',
    assigneeId: 'usr_tl_tax',
    assigneeName: 'Vikram Mehta (CA / Team Lead)',
    teamId: 'team_tax',
    dueDate: getOffsetDate(-1), // OVERDUE
    priority: 'URGENT',
    status: 'UNDER_REVIEW',
    createdAt: getOffsetDate(-12),
    updatedAt: getOffsetDate(0),
    estimatedHours: 15,
  },
  {
    id: 'tsk_106',
    title: 'Transfer Pricing Documentation & Benchmark Analysis',
    description: 'Perform TP benchmarking on Capital IQ for international transactions.',
    clientId: 'cli_global',
    clientName: 'Global Tech Solutions',
    assigneeId: 'usr_emp2',
    assigneeName: 'Neha Kapoor',
    teamId: 'team_tax',
    dueDate: getOffsetDate(5), // NORMAL
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    createdAt: getOffsetDate(-4),
    updatedAt: getOffsetDate(-4),
    estimatedHours: 20,
  },
  {
    id: 'tsk_107',
    title: 'Director KYC (DIR-3 KYC) Web Verification',
    description: 'Verify OTPs and submit DIR-3 KYC forms for all board members.',
    clientId: 'cli_nexus',
    clientName: 'Nexus Foods',
    assigneeId: 'usr_emp4',
    assigneeName: 'Sneha Rao',
    teamId: 'team_comp',
    dueDate: getOffsetDate(0), // DUE TODAY
    priority: 'HIGH',
    status: 'COMPLETED',
    createdAt: getOffsetDate(-6),
    updatedAt: getOffsetDate(0),
    completedAt: getOffsetDate(0),
    estimatedHours: 4,
  },
  {
    id: 'tsk_108',
    title: 'Voucher Verification & Ledger Auditing',
    description: 'Review purchase and sales vouchers for Q1 reconciliation.',
    clientId: 'cli_abc',
    clientName: 'ABC Pvt Ltd',
    assigneeId: 'usr_intern1',
    assigneeName: 'Aarav Joshi (Articled Assistant)',
    teamId: 'team_tax',
    dueDate: getOffsetDate(3), // DUE SOON
    priority: 'LOW',
    status: 'IN_PROGRESS',
    createdAt: getOffsetDate(-3),
    updatedAt: getOffsetDate(-1),
    estimatedHours: 16,
  },
  {
    id: 'tsk_109',
    title: 'Secretarial Audit Report Drafting (MR-3)',
    description: 'Draft secretarial audit checklist and compliance certificate.',
    clientId: 'cli_zenith',
    clientName: 'Zenith Real Estate',
    assigneeId: 'usr_emp4',
    assigneeName: 'Sneha Rao',
    teamId: 'team_comp',
    dueDate: getOffsetDate(7), // NORMAL
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    createdAt: getOffsetDate(-2),
    updatedAt: getOffsetDate(-2),
    estimatedHours: 14,
  },
  {
    id: 'tsk_110',
    title: 'Payroll Tax Computation (Form 16 Generation)',
    description: 'Calculate annual TDS on salary for 45 employees and generate Form 16 Part B.',
    clientId: 'cli_sun',
    clientName: 'Sun Pharma Dealers',
    assigneeId: 'usr_emp1',
    assigneeName: 'Rahul Gupta',
    teamId: 'team_tax',
    dueDate: getOffsetDate(-4), // OVERDUE
    priority: 'HIGH',
    status: 'COMPLETED',
    createdAt: getOffsetDate(-15),
    updatedAt: getOffsetDate(-4),
    completedAt: getOffsetDate(-4),
    estimatedHours: 8,
  },
  {
    id: 'tsk_111',
    title: 'GST Refund Application Filing (RFD-01)',
    description: 'Compile inverted duty structure invoices and file RFD-01 refund claim.',
    clientId: 'cli_acme',
    clientName: 'Acme Logistics',
    assigneeId: 'usr_emp2',
    assigneeName: 'Neha Kapoor',
    teamId: 'team_tax',
    dueDate: getOffsetDate(4),
    priority: 'MEDIUM',
    status: 'COMPLETED',
    createdAt: getOffsetDate(-9),
    updatedAt: getOffsetDate(-1),
    completedAt: getOffsetDate(-1),
    estimatedHours: 12,
  },
  {
    id: 'tsk_112',
    title: 'Share Allotment ROC Filing (PAS-3)',
    description: 'Draft board resolution and valuation certificate attachment for PAS-3.',
    clientId: 'cli_global',
    clientName: 'Global Tech Solutions',
    assigneeId: 'usr_intern2',
    assigneeName: 'Kavya Nair (Articled Assistant)',
    teamId: 'team_comp',
    dueDate: getOffsetDate(1),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: getOffsetDate(-4),
    updatedAt: getOffsetDate(0),
    estimatedHours: 5,
  },
];

// Generate deterministic 30 days attendance records for each user
export const MOCK_ATTENDANCE: AttendanceRecord[] = [];

const generateAttendance = () => {
  const users = MOCK_USERS;
  const days = 30;

  for (let i = days - 1; i >= 0; i--) {
    const dateStr = getOffsetDate(-i);
    const dayOfWeek = new Date(dateStr).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    users.forEach((usr) => {
      let status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'HALF_DAY' = 'PRESENT';
      let checkIn = '09:30';
      let checkOut = '18:30';
      let workHours = 9;

      if (isWeekend) {
        // Skip weekend or mark absent/leave
        return;
      }

      // Pseudo-random deterministic status based on char codes
      const hash = (usr.id.charCodeAt(usr.id.length - 1) + i) % 10;
      if (hash === 9) {
        status = 'ON_LEAVE';
        checkIn = '-';
        checkOut = '-';
        workHours = 0;
      } else if (hash === 8) {
        status = 'HALF_DAY';
        checkIn = '09:45';
        checkOut = '14:00';
        workHours = 4.25;
      } else if (hash === 7 && usr.role === 'EMPLOYEE') {
        status = 'ABSENT';
        checkIn = '-';
        checkOut = '-';
        workHours = 0;
      } else {
        const offsetMins = (hash * 5) % 30;
        checkIn = `09:${15 + offsetMins}`;
        checkOut = `18:${30 + (hash % 15)}`;
        workHours = 8.5 + (hash % 2) * 0.5;
      }

      MOCK_ATTENDANCE.push({
        id: `att_${usr.id}_${i}`,
        employeeId: usr.id,
        employeeName: usr.name,
        department: usr.department,
        teamId: usr.teamId || 'team_tax',
        date: dateStr,
        status,
        checkIn,
        checkOut,
        workHours,
      });
    });
  }
};

generateAttendance();

export const MOCK_RECEIVABLES: Receivable[] = [
  {
    id: 'rec_001',
    clientId: 'cli_abc',
    clientName: 'ABC Pvt Ltd',
    invoiceNumber: 'INV-2026-089',
    amount: 145000,
    dueDate: getOffsetDate(-15),
    status: 'OVERDUE',
    paidAmount: 45000,
  },
  {
    id: 'rec_002',
    clientId: 'cli_global',
    clientName: 'Global Tech Solutions',
    invoiceNumber: 'INV-2026-102',
    amount: 280000,
    dueDate: getOffsetDate(5),
    status: 'PENDING',
    paidAmount: 0,
  },
  {
    id: 'rec_003',
    clientId: 'cli_sun',
    clientName: 'Sun Pharma Dealers',
    invoiceNumber: 'INV-2026-074',
    amount: 95000,
    dueDate: getOffsetDate(-5),
    status: 'OVERDUE',
    paidAmount: 0,
  },
  {
    id: 'rec_004',
    clientId: 'cli_acme',
    clientName: 'Acme Logistics',
    invoiceNumber: 'INV-2026-118',
    amount: 210000,
    dueDate: getOffsetDate(12),
    status: 'PENDING',
    paidAmount: 50000,
  },
  {
    id: 'rec_005',
    clientId: 'cli_zenith',
    clientName: 'Zenith Real Estate',
    invoiceNumber: 'INV-2026-056',
    amount: 320000,
    dueDate: getOffsetDate(-30),
    status: 'OVERDUE',
    paidAmount: 100000,
  },
];

export const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'app_001',
    employeeId: 'usr_emp1',
    employeeName: 'Rahul Gupta',
    type: 'LEAVE',
    startDate: getOffsetDate(3),
    endDate: getOffsetDate(5),
    reason: 'Family wedding ceremony',
    status: 'PENDING',
    createdAt: getOffsetDate(-1),
  },
  {
    id: 'app_002',
    employeeId: 'usr_emp3',
    employeeName: 'Siddharth Patel',
    type: 'ATTENDANCE_REGULARIZATION',
    startDate: getOffsetDate(-2),
    reason: 'Client site audit visit - delayed biometric check-in',
    status: 'PENDING',
    createdAt: getOffsetDate(-1),
  },
  {
    id: 'app_003',
    employeeId: 'usr_intern1',
    employeeName: 'Aarav Joshi (Articled Assistant)',
    type: 'LEAVE',
    startDate: getOffsetDate(7),
    endDate: getOffsetDate(14),
    reason: 'CA Intermediate exam preparation leave',
    status: 'PENDING',
    createdAt: getOffsetDate(-2),
  },
];
