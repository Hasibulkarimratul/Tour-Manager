/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Member, type Expense, type MemberBalance, type Transaction } from '@/src/types';

export function isExpenseValid(exp: Expense, members: Member[]): boolean {
  const memberIds = new Set(members.map((m) => m.id));
  const payerIds = Object.keys(exp.payers);
  const beneficiaryIds = Object.keys(exp.beneficiaries);
  return payerIds.every(id => memberIds.has(id)) && beneficiaryIds.every(id => memberIds.has(id));
}

export function calculateBalances(members: Member[], expenses: Expense[]): MemberBalance[] {
  const balancesMap: { [id: string]: { paid: number; share: number; p2pPaid: number; p2pReceived: number } } = {};

  members.forEach((m) => {
    balancesMap[m.id] = { paid: 0, share: 0, p2pPaid: 0, p2pReceived: 0 };
  });

  expenses.forEach((exp) => {
    // Check if the transaction is valid (all payers and beneficiaries exist in members list)
    if (!isExpenseValid(exp, members)) return; // Skip invalid transactions entirely

    if (exp.category === 'payment') {
      // P2P Payment
      Object.entries(exp.payers).forEach(([memberId, amount]) => {
        balancesMap[memberId].p2pPaid += Number(amount);
      });
      Object.entries(exp.beneficiaries).forEach(([memberId, amount]) => {
        balancesMap[memberId].p2pReceived += Number(amount);
      });
    } else {
      // Regular Expense
      Object.entries(exp.payers).forEach(([memberId, amount]) => {
        balancesMap[memberId].paid += Number(amount);
      });
      Object.entries(exp.beneficiaries).forEach(([memberId, amount]) => {
        balancesMap[memberId].share += Number(amount);
      });
    }
  });

  return members.map((member) => {
    const netPaid = balancesMap[member.id].paid + balancesMap[member.id].p2pPaid - balancesMap[member.id].p2pReceived;
    return {
      member,
      totalPaid: Number(netPaid.toFixed(2)),
      totalShare: Number(balancesMap[member.id].share.toFixed(2)),
      netBalance: Number((netPaid - balancesMap[member.id].share).toFixed(2)),
    };
  });
}

export function simplifyDebts(balances: MemberBalance[]): Transaction[] {
  const transactions: Transaction[] = [];
  
  // Use a map to handle net amounts to avoid precision errors during calculation
  let netAmounts = balances.map(b => ({
    id: b.member.id,
    net: b.netBalance
  })).filter(b => Math.abs(b.net) > 0.01);

  // Separate into debtors and creditors
  let debtors = netAmounts.filter(a => a.net < 0).sort((a, b) => a.net - b.net); // Most negative first
  let creditors = netAmounts.filter(a => a.net > 0).sort((a, b) => b.net - a.net); // Most positive first

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debt = Math.abs(debtors[d].net);
    const credit = creditors[c].net;
    const settleAmount = Math.min(debt, credit);

    if (settleAmount > 0.01) {
      transactions.push({
        from: debtors[d].id,
        to: creditors[c].id,
        amount: Number(settleAmount.toFixed(2))
      });
    }

    debtors[d].net += settleAmount;
    creditors[c].net -= settleAmount;

    if (Math.abs(debtors[d].net) < 0.01) d++;
    if (Math.abs(creditors[c].net) < 0.01) c++;
  }

  return transactions;
}

export function generateCSV(balances: MemberBalance[], settlements: Transaction[]): string {
  let csv = "Member Name,Phone,Total Paid,Total Share,Net Balance\n";
  balances.forEach((b) => {
    csv += `"${b.member.name}","${b.member.phoneNumber}",${b.totalPaid.toFixed(2)},${b.totalShare.toFixed(2)},${b.netBalance.toFixed(2)}\n`;
  });

  csv += "\nPAYMENT PLAN (Simplify Debts)\n";
  csv += "From,To,Amount\n";
  settlements.forEach((s) => {
    const fromName = balances.find(b => b.member.id === s.from)?.member.name || s.from;
    const toName = balances.find(b => b.member.id === s.to)?.member.name || s.to;
    csv += `"${fromName}","${toName}",${s.amount.toFixed(2)}\n`;
  });

  return csv;
}

export function generateMemberDetailsCSV(member: Member, expenses: Expense[]): string {
  let csv = "Date,Expense/Event Name,Paid Amount,Consumed/Share Amount,Notes\n";
  
  const memberExpenses = expenses
    .filter((e) => e.payers[member.id] || e.beneficiaries[member.id])
    .sort((a, b) => new Date(a.dateTime || "").getTime() - new Date(b.dateTime || "").getTime());

  memberExpenses.forEach(exp => {
    const paid = exp.payers[member.id] || 0;
    const consumed = exp.beneficiaries[member.id] || 0;
    const date = exp.dateTime ? new Date(exp.dateTime).toLocaleString() : '';
    csv += `"${date}","${exp.name}",${paid.toFixed(2)},${consumed.toFixed(2)},"${exp.notes?.replace(/"/g, '""') || ''}"\n`;
  });

  return csv;
}

export function generateExpenseBreakdownCSV(expenses: Expense[], members: Member[]): string {
  let csv = "Date,Category,Expense/Event Name,Total Amount,Payers,Beneficiaries/Sharers,Notes\n";
  const getNames = (idsObj: any) => Object.entries(idsObj).map(([id, amt]) => `${members.find(m => m.id === id)?.name || id} (${Number(amt).toFixed(2)})`).join(" | ");

  const sorted = [...expenses].sort((a, b) => new Date(a.dateTime || "").getTime() - new Date(b.dateTime || "").getTime());
  sorted.forEach(exp => {
    const date = exp.dateTime ? new Date(exp.dateTime).toLocaleString() : '';
    csv += `"${date}","${exp.category || 'expense'}","${exp.name}",${exp.totalAmount.toFixed(2)},"${getNames(exp.payers)}","${getNames(exp.beneficiaries)}","${exp.notes?.replace(/"/g, '""') || ''}"\n`;
  });

  return csv;
}

export function generateDetailedBreakdownCSV(tour: import('@/src/types').Tour, balances: MemberBalance[], settlements: Transaction[]): string {
  let csv = `Tour Name: "${tour.name}"\nStart Date: "${tour.date || ''}"\n\n`;
  csv += `MEMBERS SUMMARY\n`;
  csv += generateCSV(balances, settlements);
  csv += `\nEXPENSE BREAKDOWN\n`;
  csv += generateExpenseBreakdownCSV(tour.expenses, tour.members);
  return csv;
}

export function generateReceiptsCSV(expenses: Expense[]): string {
  let csv = "Date,Expense Name,Total Amount,Has Receipt Image,Notes\n";
  const sorted = [...expenses].sort((a, b) => new Date(a.dateTime || "").getTime() - new Date(b.dateTime || "").getTime());
  sorted.forEach(exp => {
    const date = exp.dateTime ? new Date(exp.dateTime).toLocaleString() : '';
    csv += `"${date}","${exp.name}",${exp.totalAmount.toFixed(2)},${exp.voucherImage ? 'Yes' : 'No'},"${exp.notes?.replace(/"/g, '""') || ''}"\n`;
  });
  return csv;
}

export function generateDebtBreakdownCSV(settlements: Transaction[], balances: MemberBalance[]): string {
  let csv = "From (Debtor),To (Creditor),Amount to Settle\n";
  settlements.forEach((s) => {
    const fromName = balances.find(b => b.member.id === s.from)?.member.name || s.from;
    const toName = balances.find(b => b.member.id === s.to)?.member.name || s.to;
    csv += `"${fromName}","${toName}",${s.amount.toFixed(2)}\n`;
  });
  return csv;
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  let locale = 'en-US';
  
  if (currencyCode === 'BDT') locale = 'en-BD';
  else if (currencyCode === 'EUR') locale = 'en-IE';
  else if (currencyCode === 'GBP') locale = 'en-GB';
  else if (currencyCode === 'INR') locale = 'en-IN';
  else if (currencyCode === 'AUD') locale = 'en-AU';
  else if (currencyCode === 'CAD') locale = 'en-CA';
  else if (currencyCode === 'SGD') locale = 'en-SG';
  else if (currencyCode === 'JPY') locale = 'ja-JP';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
