import pool from '../config/db.js';

export const findRiderByUserId = async (userId) => {
    const [rows] = await pool.query(
        "SELECT * FROM riders WHERE user_id = ?",
        [userId]
    );
    return rows;
}
