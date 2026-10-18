import { createContext, useContext, useState } from 'react';
import { VAULT_DEMO_RECORDS } from '../data/preview';

const VaultPreviewContext = createContext(null);

/** Only favorite flags change in memory. This is not a vault or credential store. */
export function VaultPreviewProvider({ children }) {
  const [favorites, setFavorites] = useState(() => new Set(['demo-orbit', 'demo-cloud']));
  const toggleFavorite = (id) => setFavorites((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const records = VAULT_DEMO_RECORDS.map((record) => ({ ...record, favorite: favorites.has(record.id) }));
  return <VaultPreviewContext.Provider value={{ records, toggleFavorite }}>{children}</VaultPreviewContext.Provider>;
}

export function useVaultPreview() {
  const value = useContext(VaultPreviewContext);
  if (!value) throw new Error('Vault preview requires VaultPreviewProvider');
  return value;
}
