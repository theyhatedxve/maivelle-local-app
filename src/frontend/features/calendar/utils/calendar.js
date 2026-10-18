/** Local calendar dates: never convert date-only values through UTC. */
export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function moveMonth(date, offset) {
  const start = new Date(date.getFullYear(), date.getMonth() + offset, 1, 12);
  const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0, 12).getDate();
  return new Date(start.getFullYear(), start.getMonth(), Math.min(date.getDate(), lastDay), 12);
}

export function monthDays(month) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0, 12).getDate();
  const size = Math.ceil((start.getDay() + count) / 7) * 7;
  return Array.from({ length: size }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), index - start.getDay() + 1, 12);
    return { date, key: dateKey(date), inMonth: date.getMonth() === start.getMonth() };
  });
}
