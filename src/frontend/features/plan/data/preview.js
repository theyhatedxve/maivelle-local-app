import { dateKey } from '@/frontend/features/calendar/utils/calendar';

/** Disposable samples relative to the day this preview is opened. No database writes. */
export function createPlanPreview(today) {
  const key = (offset) => dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, 12));
  return {
    events: [
      { id: 'event-1', date: key(0), title: 'Weekly review', time: '9:00 AM – 9:30 AM', status: 'success' },
      { id: 'event-2', date: key(0), title: 'Plan a personal project', time: '2:00 PM – 3:00 PM', status: 'warning' },
      { id: 'event-3', date: key(0), title: 'Evening check-in', time: '6:00 PM – 6:15 PM', status: 'error' },
      { id: 'event-4', date: key(2), title: 'Organize travel ideas', time: '10:00 AM – 11:00 AM', status: 'success' },
      { id: 'event-5', date: key(5), title: 'Review the monthly budget', time: '4:00 PM – 4:30 PM', status: 'warning' },
    ],
    tasks: [
      { id: 'task-1', title: 'Review weekly plans', tag: '#planning', priority: 'High', due: key(0), status: 'todo' },
      { id: 'task-2', title: 'Plan the week ahead', tag: '#personal', priority: 'Medium', due: key(1), status: 'todo' },
      { id: 'task-3', title: 'Organize travel ideas', tag: '#travel', priority: 'Low', due: key(2), status: 'todo' },
      { id: 'task-4', title: 'Make time for a personal project', tag: '#personal', priority: 'Medium', due: key(5), status: 'todo' },
      { id: 'task-5', title: 'Sort saved reading notes', tag: '#notes', priority: 'Low', due: key(1), status: 'progress' },
      { id: 'task-6', title: 'Draft a monthly budget', tag: '#money', priority: 'High', due: key(3), status: 'progress' },
      { id: 'task-7', title: 'Write down this week’s priorities', tag: '#planning', priority: 'Medium', due: key(-1), status: 'done' },
    ],
  };
}
