const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createOrdersTable() {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Creating orders table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(255) PRIMARY KEY,
                amount DECIMAL(10, 2) NOT NULL,
                currency VARCHAR(10) DEFAULT 'INR',
                status VARCHAR(50) DEFAULT 'created',
                receipt VARCHAR(255),
                paymentId VARCHAR(255),
                userId VARCHAR(255),
                eventId VARCHAR(255),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Orders table created successfully.');
    } catch (error) {
        console.error('Error creating orders table:', error);
    } finally {
        await connection.end();
    }
}

createOrdersTable();
