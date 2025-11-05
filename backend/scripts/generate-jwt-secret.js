#!/usr/bin/env node
/**
 * Generate a secure JWT secret key
 * Usage: node scripts/generate-jwt-secret.js
 */

import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Generated JWT Secret:');
console.log('─'.repeat(80));
console.log(secret);
console.log('─'.repeat(80));
console.log('\n💡 Copy this to your server/.env file as:');
console.log(`JWT_SECRET=${secret}\n`);


