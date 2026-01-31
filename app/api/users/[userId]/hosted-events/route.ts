import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        // Fetch events created by the user with any status
        const query = `
      SELECT * FROM events 
      WHERE creatorId = ? 
      ORDER BY createdAt DESC
    `;

        const [rows]: any = await pool.query(query, [userId]);

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error("Error fetching hosted events:", error);
        return NextResponse.json({ error: "Failed to fetch hosted events", details: error.message }, { status: 500 });
    }
}
