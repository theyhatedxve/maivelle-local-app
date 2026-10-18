/** Public, fictional UI samples. No real credentials or database seeds. */
export const DEMO_PASSWORD = 'DemoOnly!42';
export const VAULT_DEMO_RECORDS = Object.freeze([
  { id: 'demo-orbit', title: 'Orbit hosting', username: 'demo@maivelle.example', website: 'https://orbit.example', tag: 'work', icon: 'globe-outline', notes: 'Fictional hosting account for the design preview.' },
  { id: 'demo-mail', title: 'Northstar mail', username: 'hello@maivelle.example', website: 'https://mail.example', tag: 'personal', icon: 'mail-outline', notes: 'Fictional mail account. No real login is connected.' },
  { id: 'demo-cloud', title: 'Juniper cloud', username: 'demo-user', website: 'https://cloud.example', tag: 'cloud', icon: 'cloud-outline', notes: 'Fictional cloud account for previewing this layout.' },
  { id: 'demo-notes', title: 'Papertrail notes', username: 'demo@maivelle.example', website: 'https://notes.example', tag: 'work', icon: 'document-text-outline', notes: 'Fictional project notes account.' },
  { id: 'demo-storage', title: 'Harbor storage', username: 'demo-user', website: 'https://storage.example', tag: 'cloud', icon: 'folder-outline', notes: 'Fictional storage account. Nothing is uploaded.' },
  { id: 'demo-social', title: 'Meadow social', username: 'demo@maivelle.example', website: 'https://social.example', tag: 'personal', icon: 'people-outline', notes: 'Fictional personal account for this UI preview.' },
].map((record) => Object.freeze(record)));
