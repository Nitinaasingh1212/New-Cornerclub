import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const query = `
      SELECT e.* 
      FROM favorites f
      JOIN events e ON f.eventId = e.id
      WHERE f.userId = ?
    `;

        const [rows]: any = await pool.query(query, [userId]);

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error("Error fetching user favorites:", error);
        return NextResponse.json({ error: "Failed to fetch favorites", details: error.message }, { status: 500 });
    }
}
