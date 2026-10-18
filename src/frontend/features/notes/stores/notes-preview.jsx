import { createContext, useContext, useRef, useState } from 'react';
import { createNotesPreview } from '../data/preview';

const NotesPreviewContext = createContext(null);

/** In-memory UI preview only. No filesystem, storage, or repository access. */
export function NotesPreviewProvider({ children }) {
  const [notes, setNotes] = useState(createNotesPreview);
  const nextId = useRef(0);
  const updateNote = (id, changes) => setNotes((current) => current.map((note) => note.id === id
    ? { ...note, ...changes, updatedAt: new Date().toISOString() } : note));
  const createNote = () => {
    const id = `draft-note-${++nextId.current}`;
    setNotes((current) => [{ id, title: '', body: '', tag: '', checklist: [], favorite: false, pinned: false, updatedAt: new Date().toISOString() }, ...current]);
    return id;
  };
  return <NotesPreviewContext.Provider value={{ notes, updateNote, createNote }}>{children}</NotesPreviewContext.Provider>;
}

export function useNotesPreview() {
  const context = useContext(NotesPreviewContext);
  if (!context) throw new Error('Notes preview requires NotesPreviewProvider');
  return context;
}
