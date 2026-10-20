import { dateKey } from '@/frontend/features/calendar/utils/calendar';

export function parseIncomeAmount(text) {
  const value = text.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(result) ? result : null;
}

export function formatIncome(amountMinor) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new Error('Income requires nonnegative integer minor units');
  // Native Intl may reject BigInt. Split decimal digits to preserve exact cents
  // without passing a BigInt or a rounded fractional amount to the formatter.
  const digits = String(amountMinor).padStart(3, '0');
  const whole = Number(digits.slice(0, -2));
  const fraction = digits.slice(-2);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .formatToParts(whole).map((part) => part.type === 'fraction' ? fraction : part.value).join('');
}

export function selectIncome(entries, { allTime = false, category = 'all', today = new Date() } = {}) {
  const month = dateKey(today).slice(0, 7);
  return entries.filter((entry) => entry.kind === 'income' && entry.currency === 'PHP'
    && (allTime || entry.date.startsWith(month + '-')) && (category === 'all' || entry.category === category))
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function totalIncome(entries) {
  return entries.reduce((total, entry) => {
    const next = total + entry.amountMinor;
    if (!Number.isSafeInteger(entry.amountMinor) || entry.amountMinor < 0 || !Number.isSafeInteger(next)) {
      throw new Error('Income totals require safe, nonnegative integer minor units');
    }
    return next;
  }, 0);
}

export function incomeBuckets(entries, today, allTime = false) {
  const filtered = selectIncome(entries, { today, allTime });
  if (allTime) {
    return [...new Set(filtered.map((entry) => entry.date.slice(0, 7)))].sort().map((month) => ({
      key: month,
      label: new Date(Number(month.slice(0, 4)), Number(month.slice(5)) - 1, 1, 12).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
      amountMinor: totalIncome(filtered.filter((entry) => entry.date.startsWith(month + '-'))),
    }));
  }
  const days = new Date(today.getFullYear(), today.getMonth() + 1, 0, 12).getDate();
  return Array.from({ length: Math.ceil(days / 7) }, (_, index) => ({
    key: `week-${index + 1}`, label: `W${index + 1}`,
    description: `Days ${index * 7 + 1}–${Math.min((index + 1) * 7, days)}`,
    amountMinor: totalIncome(filtered.filter((entry) => Math.floor((Number(entry.date.slice(8)) - 1) / 7) === index)),
  }));
}

export function validIncomeDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1000 || month < 1 || month > 12 || day < 1) return false;
  return dateKey(new Date(year, month - 1, day, 12)) === value;
}
