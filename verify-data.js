require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function verify() {
    console.log("Verifying Database Content...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [tables] = await connection.execute('SHOW TABLES');
        console.log("Tables found:");
        tables.forEach(t => console.log(` - ${Object.values(t)[0]}`));

        const [events] = await connection.execute('SELECT title, status, date FROM events');
        console.log("\nEvents in database:");
        events.forEach(e => console.log(` - [${e.status}] ${e.title} (${e.date})`));

    } catch (err) {
        console.error("Verification failed:", err.message);
    } finally {
        await connection.end();
    }
}

verify();
