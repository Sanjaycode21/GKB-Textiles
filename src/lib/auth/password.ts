import crypto from 'crypto';

/**
 * Hashes a password using Node's cryptographically secure scrypt with a unique random salt.
 * Formatted as: salt:derivedKey
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored salt:derivedKey hash in constant time
 * to prevent timing analysis attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }
  
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, k) => {
      if (err) reject(err);
      else resolve(k);
    });
  });
  
  if (keyBuffer.length !== derivedKey.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Generates a high-entropy cryptographically random hex token.
 */
export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generates a 6-digit numeric OTP code for 2FA verification.
 */
export function generateNumericOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }
  return otp;
}

