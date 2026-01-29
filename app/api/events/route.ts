import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitVal = parseInt(searchParams.get('limit') || '50');
        const city = searchParams.get('city');
        const category = searchParams.get('category');

        let query = `
      SELECT e.*, u.name as creatorName, u.profileImage as creatorAvatar 
      FROM events e 
      LEFT JOIN users u ON e.creatorId = u.id 
      WHERE e.status = 'approved' AND e.date >= NOW()
    `;
        let params: any[] = [];

        if (city && city !== "All") {
            query += " AND e.city = ?";
            params.push(city);
        }
        if (category && category !== "All") {
            query += " AND e.category = ?";
            params.push(category);
        }

        query += " ORDER BY e.date ASC LIMIT ?";
        params.push(limitVal);

        const [rows]: any = await pool.query(query, params);

        // Format for frontend (nest creator info and parse JSON)
        const enrichedEvents = rows.map((row: any) => ({
            ...row,
            social: typeof row.social === 'string' ? JSON.parse(row.social || '{}') : row.social,
            gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : row.gallery,
            creator: {
                name: row.creatorName,
                avatar: row.creatorAvatar
            }
        }));

        return NextResponse.json(enrichedEvents);
    } catch (error: any) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events", details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const {
            id, title, description, date, time, location, city, category,
            price, currency, image, capacity, creatorId, organizer, phone, address, social, gallery
        } = data;

        const query = `
      INSERT INTO events (
        id, title, description, date, time, location, city, category, 
        price, currency, image, capacity, creatorId, organizer, phone, address, social, gallery, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      ON DUPLICATE KEY UPDATE 
      title=?, description=?, date=?, time=?, location=?, city=?, category=?, 
      price=?, currency=?, image=?, capacity=?, organizer=?, phone=?, address=?, social=?, gallery=?, status='pending'
    `;

        const socialJson = JSON.stringify(social || {});
        const galleryJson = JSON.stringify(gallery || []);

        const params = [
            id || `evt_${Date.now()}`, title, description, date, time, location, city, category,
            price, currency || 'INR', image, capacity, creatorId, organizer, phone, address, socialJson, galleryJson,
            title, description, date, time, location, city, category,
            price, currency || 'INR', image, capacity, organizer, phone, address, socialJson, galleryJson
        ];

        await pool.query(query, params);
        return NextResponse.json({ success: true, message: "Event created and pending approval" });
    } catch (error: any) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Failed to create event", details: error.message }, { status: 500 });
    }
}
