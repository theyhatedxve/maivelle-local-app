export function findNotes(notes, query = '', filter = 'all') {
  const search = query.trim().toLowerCase();
  return notes.filter((note) => (filter !== 'favorites' || note.favorite)
    && (filter !== 'checklists' || note.checklist.length > 0)
    && `${note.title} ${note.body} ${note.tag} ${note.checklist.map((item) => item.text).join(' ')}`.toLowerCase().includes(search))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
}

export function formatNoteText(text, selection, kind) {
  const start = Math.max(0, Math.min(selection?.start ?? text.length, text.length));
  const end = Math.max(start, Math.min(selection?.end ?? start, text.length));
  const selected = text.slice(start, end);
  const formats = {
    bold: `**${selected || 'bold text'}**`,
    italic: `*${selected || 'italic text'}*`,
    bullet: `${start && text[start - 1] !== '\n' ? '\n' : ''}- ${selected || 'List item'}`,
    numbered: `${start && text[start - 1] !== '\n' ? '\n' : ''}1. ${selected || 'List item'}`,
    link: `[${selected || 'link text'}](https://)`,
  };
  const insertion = formats[kind];
  if (insertion === undefined) return { text, selection: { start, end } };
  const position = start + insertion.length;
  return { text: text.slice(0, start) + insertion + text.slice(end), selection: { start: position, end: position } };
}
