import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Validate JWT_SECRET is set
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in .env file');
  console.log('💡 Please create server/.env file with a secure JWT_SECRET');
  console.log('💡 You can generate one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

/**
 * Generate JWT Token
 * @param {string|ObjectId} userId - User ID to encode in token
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Decode JWT Token (without verification - use carefully)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN
};

