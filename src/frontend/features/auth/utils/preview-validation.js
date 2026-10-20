// Public demo values. Never use these as real passwords or security defaults.
export const DEMO_PASSWORDS = { app: 'MaivelleDemo!', vault: 'VaultDemo!42' };

export function validateSetupPassword(password, confirmation) {
  if (!password) return 'Enter a demo password.';
  if (password.length < 8) return 'Use at least 8 characters for this preview.';
  if (password !== confirmation) return 'The passwords do not match.';
  return '';
}
