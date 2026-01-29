import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = await params;
        const [rows]: any = await pool.query(
            "SELECT * FROM events WHERE creatorId = ? ORDER BY createdAt DESC",
            [userId]
        );

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error("Error fetching hosted events:", error);
        return NextResponse.json({ error: "Failed to fetch hosted events" }, { status: 500 });
    }
}
