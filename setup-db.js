require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log("Starting database setup...");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        // Read setup script
        const schema = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');
        console.log("Applying schema...");
        await connection.query(schema);
        console.log("✅ Schema applied successfully.");

        // Read seed data
        const seed = fs.readFileSync(path.join(__dirname, 'seed_data.sql'), 'utf8');
        console.log("Seeding data...");
        await connection.query(seed);
        console.log("✅ Data seeded successfully.");

    } catch (err) {
        console.error("❌ Database setup failed!");
        console.error(err);
    } finally {
        await connection.end();
    }
}

setupDatabase();
