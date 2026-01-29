require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log("Attempting to connect with:");
    console.log("Host:", process.env.DB_HOST);
    console.log("Database:", process.env.DB_NAME);
    console.log("User:", process.env.DB_USER);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log("✅ Success! Connected to MySQL.");

        const [rows] = await connection.execute('SHOW TABLES');
        console.log("Tables found:", rows);

        await connection.end();
    } catch (err) {
        console.error("❌ Connection failed!");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
    }
}

testConnection();
