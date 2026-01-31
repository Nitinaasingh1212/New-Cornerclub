const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");
const mysql = require('mysql2/promise');

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();
const app = express();
const port = process.env.PORT || 5001;

// Allow origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://corner-club-admin-frontend.vercel.app'];

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// --- Admin API ---

// Generic Events for compatibility with Context
app.get('/api/events', async (req, res) => {
    try {
        const query = `
            SELECT e.*, 
                   u.name as creatorName, 
                   u.email as creatorEmail, 
                   u.phone as creatorPhone, 
                   u.profileImage as creatorImage,
                   u.bio as creatorBio,
                   u.city as creatorCity,
                   u.social as creatorSocial
            FROM events e
            LEFT JOIN users u ON e.creatorId = u.id
            WHERE e.status = 'approved'
            ORDER BY e.date ASC
        `;
        const [rows] = await pool.query(query);
        const events = rows.map(row => {
            const eventSocial = typeof row.social === 'string' ? JSON.parse(row.social || '{}') : row.social;
            const creatorSocial = typeof row.creatorSocial === 'string' ? JSON.parse(row.creatorSocial || '{}') : (row.creatorSocial || {});

            return {
                ...row,
                social: eventSocial,
                gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : row.gallery,
                organizer: {
                    name: row.organizer || row.creatorName,
                    email: row.creatorEmail,
                    phone: row.phone || row.creatorPhone,
                    photoURL: row.creatorImage,
                    bio: row.creatorBio,
                    city: row.city || row.creatorCity, // Use event city, fallback to creator city
                    social: (eventSocial && Object.keys(eventSocial).length > 0) ? eventSocial : creatorSocial
                }
            }
        });
        res.json(events);
    } catch (error) {
        console.error("Error fetching generic events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// Get pending events
app.get('/api/admin/events/pending', async (req, res) => {
    try {
        const query = `
            SELECT e.*, 
                   u.name as creatorName, 
                   u.email as creatorEmail, 
                   u.phone as creatorPhone,
                   u.profileImage as creatorImage,
                   u.bio as creatorBio,
                   u.city as creatorCity,
                   u.social as creatorSocial
            FROM events e
            LEFT JOIN users u ON e.creatorId = u.id
            WHERE e.status = 'pending'
            ORDER BY e.createdAt DESC
        `;
        const [rows] = await pool.query(query);

        // Format for frontend
        const events = rows.map(row => {
            const eventSocial = typeof row.social === 'string' ? JSON.parse(row.social || '{}') : row.social;
            const creatorSocial = typeof row.creatorSocial === 'string' ? JSON.parse(row.creatorSocial || '{}') : (row.creatorSocial || {});

            return {
                ...row,
                social: eventSocial,
                gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : row.gallery,
                organizer: {
                    name: row.organizer || row.creatorName,
                    email: row.creatorEmail,
                    phone: row.phone || row.creatorPhone,
                    photoURL: row.creatorImage,
                    bio: row.creatorBio,
                    city: row.city || row.creatorCity,
                    social: (eventSocial && Object.keys(eventSocial).length > 0) ? eventSocial : creatorSocial
                }
            }
        });

        res.json(events);
    } catch (error) {
        console.error("Error fetching pending events:", error);
        res.status(500).json({ error: "Failed to fetch pending events" });
    }
});

// Get History (Approved + Rejected)
app.get('/api/admin/events/history', async (req, res) => {
    try {
        const query = `
            SELECT e.*, 
                   u.name as creatorName, 
                   u.email as creatorEmail, 
                   u.phone as creatorPhone,
                   u.profileImage as creatorImage,
                   u.bio as creatorBio,
                   u.city as creatorCity,
                   u.social as creatorSocial
            FROM events e
            LEFT JOIN users u ON e.creatorId = u.id
            WHERE e.status IN ('approved', 'rejected')
            ORDER BY e.createdAt DESC
        `;
        const [rows] = await pool.query(query);

        const events = rows.map(row => {
            const eventSocial = typeof row.social === 'string' ? JSON.parse(row.social || '{}') : row.social;
            const creatorSocial = typeof row.creatorSocial === 'string' ? JSON.parse(row.creatorSocial || '{}') : (row.creatorSocial || {});

            return {
                ...row,
                social: eventSocial,
                gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : row.gallery,
                organizer: {
                    name: row.organizer || row.creatorName,
                    email: row.creatorEmail,
                    phone: row.phone || row.creatorPhone,
                    photoURL: row.creatorImage,
                    bio: row.creatorBio,
                    city: row.city || row.creatorCity,
                    social: (eventSocial && Object.keys(eventSocial).length > 0) ? eventSocial : creatorSocial
                }
            }
        });

        res.json(events);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// Approve event
app.post('/api/admin/events/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "UPDATE events SET status = 'approved' WHERE id = ?";
        await pool.query(query, [id]);
        res.json({ success: true });
    } catch (error) {
        console.error("Error approving event:", error);
        res.status(500).json({ error: "Failed to approve event" });
    }
});

// Reject event
app.post('/api/admin/events/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "UPDATE events SET status = 'rejected' WHERE id = ?";
        await pool.query(query, [id]);
        res.json({ success: true });
    } catch (error) {
        console.error("Error rejecting event:", error);
        res.status(500).json({ error: "Failed to reject event" });
    }
});

// User Sync for compatibility with Context
app.post('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, displayName, photoURL } = req.body;

        const query = `
            INSERT INTO users (id, name, email, profileImage)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name = ?, profileImage = ?
        `;
        const params = [id, displayName, email, photoURL, displayName, photoURL];
        await pool.query(query, params);

        res.json({ success: true });
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ error: "Failed to sync user" });
    }
});

app.get('/', (req, res) => {
    res.send('Admin Backend is running (Admin SDK)!');
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}

module.exports = app;
