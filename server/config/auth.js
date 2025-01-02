import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import logger from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (userId) => {
    try {
        return jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
    } catch (error) {
        logger.error('Error generating token:', error);
        throw error;
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        logger.error('Error verifying token:', error);
        throw error;
    }
};

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw error;
    }
};

export const comparePasswords = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error('Error comparing passwords:', error);
        throw error;
    }
}; 