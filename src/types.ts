/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  whatsappNumber?: string;
  bkashNumber?: string;
  address?: string;
  occupation?: string;
  nid?: string;
}

export interface Split {
  memberId: string;
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  totalAmount: number;
  dateTime: string;
  payers: { [memberId: string]: number }; // memberId -> amount paid
  beneficiaries: { [memberId: string]: number }; // memberId -> share amount
  voucherImage?: string; 
  notes?: string;
  splitMode: 'equal' | 'amount' | 'percent';
  category?: 'expense' | 'payment';
  creatorId?: string;
  creatorName?: string;
  deletedAt?: number;
}

export interface Tour {
  id: string;
  name: string;
  date: string;
  country?: string;
  town?: string;
  currency?: string;
  whatsappGroupLink?: string;
  members: Member[];
  expenses: Expense[];
  deletedAt?: number;
  path?: { lat: number; lng: number; timestamp: number }[];
  adminId?: string;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface AppSettings {
  region: string;
  theme: string;
  language: string;
}

export interface MemberBalance {
  member: Member;
  totalPaid: number;
  totalShare: number;
  netBalance: number;
}
