require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function debugData() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await connection.execute("SELECT id, title, LEFT(image, 50) as imageStart, LENGTH(image) as imageLen, creatorId FROM events WHERE status = 'pending'");
        console.log("Pending Events in Database (Summary):");
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error("Debug failed:", err.message);
    } finally {
        await connection.end();
    }
}

debugData();
