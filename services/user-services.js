
const db = require('../db');

const sql = "SELECT * FROM TBL_USERS WHERE id = ?"

async function getUserById (userId) {
    try {
        const [rows] = await db.query(sql, [userId]);
        return rows[0];
    }catch (err) {
        console.error('Error getting user by ID:', err.message);
        throw err;
    }
}

async function isUserAdmin (userId) {
    try {
        const [rows] = await db.query(sql, [userId]);
        return rows.length > 0 && rows[0].ROLE === "ADMIN";
    } catch (err) {
        console.error('Error checking user admin status:', err.message);
        throw err;
    }
}

async function isUserManager (userId) {
    try {
        const [rows] = await db.query(sql, [userId]);
        return rows.length > 0 && rows[0].ROLE === "MANAGER";
    } catch (err) {
        console.error('Error checking user admin status:', err.message);
        throw err;
    }
}


module.exports = {getUserById, isUserAdmin, isUserManager}