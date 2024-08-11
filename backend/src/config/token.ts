// import crypto from "crypto"

// // Generate a random 32-byte (256-bit) buffer
// const secret = crypto.randomBytes(32);

// console.log(secret.toString("hex")); // Output: 64 characters long hexadecimal string

import crypto from 'crypto';

// Generate a random 32-byte (256-bit) buffer
const secret: Buffer = crypto.randomBytes(32);

console.log(secret.toString('hex')); // Output: 64 characters long hexadecimal string

