import crypto from 'crypto';

// Generating a random 32-byte (256-bit) buffer
const secret: Buffer = crypto.randomBytes(32);

console.log(secret.toString('hex')); // 64 characters long hexadecimal string

