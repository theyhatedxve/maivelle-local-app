import { createContext, useContext, useState } from 'react';

const PreviewContext = createContext(null);

// Navigation state only. This is deliberately not authentication or persistence.
export function PhaseOnePreviewProvider({ children }) {
  const [enteredPreview, setEnteredPreview] = useState(false);
  return <PreviewContext.Provider value={{ enteredPreview, enterPreview: () => setEnteredPreview(true) }}>{children}</PreviewContext.Provider>;
}

export const usePhaseOnePreview = () => useContext(PreviewContext);
