const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Build CA certificate path if provided
let sslConfig = false;
if (process.env.CA_CERT_PATH) {
    try {
        const caCertPath = path.join(__dirname, process.env.CA_CERT_PATH);
        if (fs.existsSync(caCertPath)) {
            sslConfig = {
                rejectUnauthorized: true,
                ca: fs.readFileSync(caCertPath).toString(),
            };
            console.log('✅ SSL certificate loaded successfully.');
        } else {
            console.warn('⚠️ CA certificate file not found at:', caCertPath);
        }
    } catch (err) {
        console.error('❌ Error reading CA certificate:', err.message);
    }
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || process.env.DB_NAME || 'financeTracking',
    password: process.env.DB_PASSWORD || 'Admin',
    ssl: sslConfig,
});

pool.on('connect', () => {
    console.log('✅ Connected to database');
});

pool.on('error', (error) => {
    console.error('❌ Database connection error:', error);
    process.exit(-1);
});

// Keep your existing query interface
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
