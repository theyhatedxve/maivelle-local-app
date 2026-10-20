import { dateKey } from '@/frontend/features/calendar/utils/calendar';

/** Fictional income amounts in integer centavos. Never seed a database with these. */
export function createIncomePreview(today = new Date()) {
  const date = (monthOffset, day) => dateKey(new Date(today.getFullYear(), today.getMonth() + monthOffset, day, 12));
  return [
    { id: 'income-1', title: 'Consulting project', amountMinor: 5400000, category: 'Consulting', date: date(0, 2), currency: 'PHP', kind: 'income' },
    { id: 'income-2', title: 'Monthly salary', amountMinor: 3200000, category: 'Salary', date: date(0, 6), currency: 'PHP', kind: 'income' },
    { id: 'income-3', title: 'Project bonus', amountMinor: 800000, category: 'Bonus', date: date(0, 10), currency: 'PHP', kind: 'income' },
    { id: 'income-4', title: 'Freelance design', amountMinor: 660000, category: 'Freelance', date: date(0, 14), currency: 'PHP', kind: 'income' },
    { id: 'income-5', title: 'Digital product sale', amountMinor: 420000, category: 'Sales', date: date(0, 20), currency: 'PHP', kind: 'income' },
    { id: 'income-6', title: 'Consulting follow-up', amountMinor: 320000, category: 'Consulting', date: date(0, 26), currency: 'PHP', kind: 'income' },
    { id: 'income-7', title: 'Previous project', amountMinor: 13700000, category: 'Consulting', date: date(-1, 8), currency: 'PHP', kind: 'income' },
    { id: 'income-8', title: 'Previous freelance work', amountMinor: 2500000, category: 'Freelance', date: date(-1, 24), currency: 'PHP', kind: 'income' },
  ];
}

export const INCOME_CATEGORIES = ['Consulting', 'Salary', 'Bonus', 'Freelance', 'Sales'];
