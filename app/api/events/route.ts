import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitVal = parseInt(searchParams.get('limit') || '50');
        const city = searchParams.get('city');
        const category = searchParams.get('category');
        const lastDate = searchParams.get('lastDate'); // Cursor support
        const lastId = searchParams.get('lastId'); // Cursor support

        // Use a 6-hour window so events don't disappear exactly at start time
        let query = `
      SELECT e.*, u.name as creatorName, u.profileImage as creatorAvatar 
      FROM events e 
      LEFT JOIN users u ON e.creatorId = u.id 
      WHERE e.status = 'approved' AND e.date >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
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

        // Cursor logic
        if (lastDate && lastId) {
            query += " AND (e.date > ? OR (e.date = ? AND e.id > ?))";
            params.push(lastDate, lastDate, lastId);
        }

        query += " ORDER BY e.date ASC, e.id ASC LIMIT ?";
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
        const contentLength = request.headers.get('content-length');
        console.log(`[POST /api/events] Received request. Content-Length: ${contentLength} bytes`);

        let data;
        try {
            data = await request.json();
        } catch (jsonError: any) {
            console.error("[POST /api/events] JSON Parse Error:", jsonError);
            return NextResponse.json({
                error: "Invalid JSON or payload too large",
                details: jsonError.message
            }, { status: 400 });
        }

        const {
            id, title, description, date, time, location, city, category,
            price, currency, image, capacity, creatorId, organizer, phone, address, social, gallery
        } = data;

        console.log(`[POST /api/events] Title: ${title}, Creator: ${creatorId}, Images: ${image ? 'Present' : 'Missing'}, Gallery count: ${gallery?.length || 0}`);

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

        try {
            await pool.query(query, params);
        } catch (dbError: any) {
            console.error("[POST /api/events] Database Error:", dbError);
            if (dbError.code === 'ER_NET_PACKET_TOO_LARGE') {
                return NextResponse.json({
                    error: "The image or data is too large for the database.",
                    details: "Try a smaller image or fewer photos."
                }, { status: 413 });
            }
            throw dbError; // rethrow for outer catch
        }

        return NextResponse.json({ success: true, message: "Event created and pending approval" });
    } catch (error: any) {
        console.error("[POST /api/events] Unexpected Error:", error);
        return NextResponse.json({
            error: "Failed to create event",
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}
