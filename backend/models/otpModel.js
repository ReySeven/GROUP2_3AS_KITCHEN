import pool from '../config/db.js';
import crypto from 'crypto';

const sha = c => crypto.createHash('sha256').update(String(c)).digest('hex');

// Delete all existing tokens for this email, then insert a fresh one
export const save = async (email, code, expiresAt) => {
    await pool.query('DELETE FROM otp_tokens WHERE email = ?', [email]);
    await pool.query(
        'INSERT INTO otp_tokens (email, code_hash, expires_at, attempts) VALUES (?, ?, ?, 3)',
        [email, sha(code), expiresAt]
    );
};

// Find the latest token for this email
export const findByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM otp_tokens WHERE email = ? ORDER BY created_at DESC LIMIT 1',
        [email]
    );
    return rows[0] || null;
};

// Decrement attempts by 1
export const decrementAttempts = async (email) => {
    await pool.query(
        'UPDATE otp_tokens SET attempts = attempts - 1 WHERE email = ?',
        [email]
    );
};

// Remove token (after successful verification)
export const remove = async (email) => {
    await pool.query('DELETE FROM otp_tokens WHERE email = ?', [email]);
};

// Verify: returns true if code matches and token is valid; throws descriptive error otherwise
export const verify = async (email, code) => {
    const token = await findByEmail(email);
    if (!token) {
        throw new Error('No code was sent to this email. Request a new one.');
    }
    if (new Date() > new Date(token.expires_at)) {
        await remove(email);
        throw new Error('This code has expired. Request a new one.');
    }
    if (token.attempts < 1) {
        throw new Error('Too many incorrect attempts. Request a new code.');
    }
    if (sha(code) !== token.code_hash) {
        await decrementAttempts(email);
        const left = token.attempts - 1;
        if (left < 1) throw new Error('Too many incorrect attempts. Request a new code.');
        throw new Error(`Incorrect code. ${left} attempt${left > 1 ? 's' : ''} left.`);
    }
    await remove(email);
    return true;
};

export { sha };
