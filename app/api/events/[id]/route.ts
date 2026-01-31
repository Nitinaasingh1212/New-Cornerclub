import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const query = `
      SELECT e.*, u.name as creatorName, u.profileImage as creatorAvatar, u.phone as creatorPhone, u.email as creatorEmail
      FROM events e
      LEFT JOIN users u ON e.creatorId = u.id
      WHERE e.id = ?
    `;

        const [rows]: any = await pool.query(query, [id]);

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const row = rows[0];

        // Format for frontend
        const event = {
            ...row,
            social: typeof row.social === 'string' ? JSON.parse(row.social || '{}') : row.social,
            gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : row.gallery,
            creator: {
                name: row.creatorName,
                avatar: row.creatorAvatar,
                phone: row.creatorPhone,
                email: row.creatorEmail
            },
            organizer: row.organizer || row.creatorName // fallback
        };

        return NextResponse.json(event);
    } catch (error: any) {
        console.error("Error fetching event details:", error);
        return NextResponse.json({ error: "Failed to fetch event details", details: error.message }, { status: 500 });
    }
}
