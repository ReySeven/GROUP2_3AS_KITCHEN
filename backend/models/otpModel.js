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
    if (sha(code) !== token.code_hash) {
        throw new Error('Incorrect code.');
    }
    await remove(email);
    return true;
};

export { sha };
