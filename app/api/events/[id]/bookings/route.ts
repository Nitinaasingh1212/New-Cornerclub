import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const query = `
      SELECT b.*, u.name as userName, u.email as userEmail, u.phone as userPhone, u.profileImage as userAvatar
      FROM bookings b
      LEFT JOIN users u ON b.userId = u.id
      WHERE b.eventId = ?
      ORDER BY b.bookedAt DESC
    `;

        const [rows]: any = await pool.query(query, [id]);

        // Format for frontend
        const attendees = rows.map((row: any) => ({
            ...row,
            user: {
                name: row.userName,
                email: row.userEmail,
                phone: row.userPhone,
                avatar: row.userAvatar
            }
        }));

        return NextResponse.json(attendees);
    } catch (error: any) {
        console.error("Error fetching attendees:", error);
        return NextResponse.json({ error: "Failed to fetch attendees", details: error.message }, { status: 500 });
    }
}
