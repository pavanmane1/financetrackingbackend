const { db } = require('./index');
const { v4: uuidv4 } = require('uuid');

class User {
    static async create(userData) {
        const { username, passwordHash, name } = userData;
        const id = uuidv4();
        const query = `
            INSERT INTO users (id, username, password, name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, name, created_at
        `;
        const result = await db.query(query, [id, username, passwordHash, name]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, username, name, created_at, last_login FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async updateLastLogin(userId) {
        const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
        await db.query(query, [userId]);
    }
}

module.exports = User;