import Dexie, { Table } from 'dexie';

export interface Student {
  id?: number;
  name: string;
  mobile: string;
  qrCode: string;
  createdAt: Date;
}

export interface Subscription {
  id?: number;
  studentId: number;
  plan: 'Lunch' | 'Dinner' | 'Both';
  startDate: Date;
  endDate: Date;
  remainingDays: number;
  status: 'Active' | 'Expired' | 'Cancelled';
  createdAt: Date;
}

export interface Attendance {
  id?: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  meal: 'Lunch' | 'Dinner';
  timestamp: Date;
}

export interface Payment {
  id?: number;
  studentId: number;
  amount: number;
  date: Date;
  receiptId: string;
}

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  date: Date;
}

export class TopperThaliDB extends Dexie {
  students!: Table<Student>;
  subscriptions!: Table<Subscription>;
  attendance!: Table<Attendance>;
  payments!: Table<Payment>;
  expenses!: Table<Expense>;

  constructor() {
    super('TopperThaliDB');
    this.version(1).stores({
      students: '++id, mobile, qrCode',
      subscriptions: '++id, studentId, status',
      attendance: '++id, studentId, date, [studentId+date+meal]',
      payments: '++id, studentId, date',
      expenses: '++id, date'
    });
  }
}

export const db = new TopperThaliDB();
