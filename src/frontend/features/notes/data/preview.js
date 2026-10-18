/** Disposable design-review records, never database seeds. */
export function createNotesPreview(now = new Date()) {
  const timestamp = (days) => new Date(now.getTime() - days * 86400000).toISOString();
  return [
    { id: 'sample-note-1', title: 'Weekly planning checklist', body: 'Make room for what matters this week.\n\nKeep the plan simple and leave time to rest.', tag: 'planning', favorite: true, pinned: true, updatedAt: timestamp(0),
      checklist: [
        { id: 'item-1', text: 'Review last week', done: true },
        { id: 'item-2', text: 'Choose three priorities', done: true },
        { id: 'item-3', text: 'Plan time for a personal project', done: false },
        { id: 'item-4', text: 'Make a reading list', done: false },
        { id: 'item-5', text: 'Leave space for a quiet evening', done: false },
      ] },
    { id: 'sample-note-2', title: 'Travel ideas', body: 'A quiet weekend by the sea.\n\nPlaces to visit, a simple budget, and things to pack.', tag: 'travel', favorite: true, pinned: false, updatedAt: timestamp(1), checklist: [] },
    { id: 'sample-note-3', title: 'Weekly reflection', body: 'Things I am grateful for this week...\n\nWhat went well? What would I like to make time for next?', tag: 'personal', favorite: false, pinned: false, updatedAt: timestamp(2), checklist: [] },
    { id: 'sample-note-4', title: 'App ideas', body: 'A calmer place for everyday essentials.\n\nCollect ideas here as they come.', tag: 'ideas', favorite: false, pinned: false, updatedAt: timestamp(3), checklist: [] },
    { id: 'sample-note-5', title: 'Books to read', body: 'A little inspiration for the next reading session.', tag: 'reading', favorite: false, pinned: false, updatedAt: timestamp(4), checklist: [{ id: 'book-1', text: 'Choose a book for this month', done: false }] },
    { id: 'sample-note-6', title: 'Project notes', body: 'Small steps for a personal project.\n\nStart with one useful thing.', tag: 'projects', favorite: false, pinned: false, updatedAt: timestamp(5), checklist: [] },
  ];
}
