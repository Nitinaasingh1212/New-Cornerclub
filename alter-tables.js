require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log("Altering events table...");
        await connection.execute("ALTER TABLE events MODIFY COLUMN image LONGTEXT");
        console.log("Altering users table...");
        await connection.execute("ALTER TABLE users MODIFY COLUMN profileImage LONGTEXT");
        console.log("✅ Schema updated successfully!");
    } catch (err) {
        console.error("❌ Schema update failed:", err.message);
    } finally {
        await connection.end();
    }
}

updateSchema();
