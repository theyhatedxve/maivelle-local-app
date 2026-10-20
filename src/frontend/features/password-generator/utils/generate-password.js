export const CHARACTER_GROUPS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
};

// Injectable entropy makes this testable without weakening production randomness.
export async function generatePassword({ length, options }, randomBytes) {
  if (!Number.isInteger(length) || length < 8 || length > 128) throw new Error('Choose a length from 8 to 128.');
  const groups = Object.entries(CHARACTER_GROUPS).filter(([key]) => options?.[key]).map(([, chars]) => chars);
  if (!groups.length) throw new Error('Select at least one character group.');
  if (typeof randomBytes !== 'function') throw new Error('Secure randomness is unavailable.');
  const pool = groups.join('');
  const limit = Math.floor(256 / pool.length) * pool.length;
  let bytes = new Uint8Array(0);
  let offset = 0;
  let consumed = 0;
  const nextCharacter = async () => {
    while (consumed++ < 131072) {
      if (offset === bytes.length) {
        bytes = await randomBytes(256);
        if (!(bytes instanceof Uint8Array) || bytes.length !== 256) throw new Error('Secure randomness returned invalid data.');
        offset = 0;
      }
      const byte = bytes[offset++];
      if (byte < limit) return pool[byte % pool.length];
    }
    throw new Error('Secure generation could not finish. Try again.');
  };
  // Reject whole candidates to preserve uniform sampling while including each group.
  for (let attempt = 0; attempt < 128; attempt++) {
    let candidate = '';
    for (let index = 0; index < length; index++) candidate += await nextCharacter();
    if (groups.every((group) => [...candidate].some((character) => group.includes(character)))) return candidate;
  }
  throw new Error('Secure generation could not finish. Try again.');
}
