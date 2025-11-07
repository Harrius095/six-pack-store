require('dotenv').config();
const mariadb = require('mariadb');

// Pool de conexiones
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    // Si DB_PORT no está definido, no pasar NaN al pool (usa undefined para puerto por defecto)
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',
    connectionLimit: 10,
    waitForConnections: true
});

// Función para ejecutar queries
async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql, params);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { query, pool };
