require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function checkVariables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await connection.execute("SHOW VARIABLES LIKE 'max_allowed_packet'");
        console.log("MySQL Variables:");
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error("Query failed:", err.message);
    } finally {
        await connection.end();
    }
}

checkVariables();
