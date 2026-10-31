import {
  createHash,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 64;

// Формат: scrypt$N$r$p$salt$hash — параметры хранятся рядом, чтобы их можно было усилить позже
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LENGTH, SCRYPT);
  return [
    'scrypt',
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString('base64'),
    hash.toString('base64'),
  ].join('$');
};

export const verifyPassword = async (
  password: string,
  stored: string,
): Promise<boolean> => {
  const [scheme, n, r, p, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt') return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = await scryptAsync(
    password,
    Buffer.from(salt, 'base64'),
    expected.length,
    { N: Number(n), r: Number(r), p: Number(p), maxmem: SCRYPT.maxmem },
  );
  return timingSafeEqual(expected, actual);
};

export const randomToken = (bytes = 32) =>
  randomBytes(bytes).toString('base64url');

export const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

// --- TOTP (RFC 6238), совместим с Google Authenticator, Яндекс Ключом и т.п. ---

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const base32Encode = (buffer: Buffer) => {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32[(value << (5 - bits)) & 31];
  return output;
};

const base32Decode = (input: string) => {
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  for (const char of input.replace(/=+$/, '').toUpperCase()) {
    const index = BASE32.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
};

export const generateTotpSecret = () => base32Encode(randomBytes(20));

const hotp = (secret: string, counter: number) => {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac('sha1', base32Decode(secret))
    .update(buffer)
    .digest();
  const offset = digest[digest.length - 1] & 0xf;
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return code.toString().padStart(6, '0');
};

// Допускаем расхождение часов на один шаг (±30 секунд)
export const verifyTotp = (secret: string, code: string, now = Date.now()) => {
  const normalized = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(normalized)) return false;
  const step = Math.floor(now / 1000 / 30);
  return [-1, 0, 1].some((delta) =>
    timingSafeEqual(
      Buffer.from(hotp(secret, step + delta)),
      Buffer.from(normalized),
    ),
  );
};

export const totpAuthUrl = (secret: string, email: string, issuer: string) =>
  `otpauth://totp/${encodeURIComponent(`${issuer}:${email}`)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

// Резервные коды вида xxxx-xxxx, сравниваются без учёта регистра и дефиса
export const generateBackupCode = () => {
  const raw = randomBytes(5).toString('hex');
  return `${raw.slice(0, 5)}-${raw.slice(5)}`;
};

export const normalizeBackupCode = (code: string) =>
  code.toLowerCase().replace(/[^a-f0-9]/g, '');
