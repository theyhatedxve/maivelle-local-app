/** Design-review samples only. Never seed these into the local database. */
export const DASHBOARD_PREVIEW = {
  summary: { vaultItems: '10', notes: '5', openTasks: '4', income: '₱108,000.00' },
  tasks: [
    { id: 'preview-1', title: 'Review weekly plans', due: 'Today', priority: 'High', status: 'error' },
    { id: 'preview-2', title: 'Plan the week ahead', due: 'Tomorrow', priority: 'Medium', status: 'warning' },
    { id: 'preview-3', title: 'Organize travel ideas', due: 'Thursday', priority: 'Medium', status: 'warning' },
    { id: 'preview-4', title: 'Make time for a personal project', due: 'Friday', priority: 'Low', status: 'success' },
  ],
};
