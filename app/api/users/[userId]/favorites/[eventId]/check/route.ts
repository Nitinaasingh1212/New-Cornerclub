import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: { userId: string; eventId: string } }
) {
    try {
        const { userId, eventId } = await params;
        const [rows]: any = await pool.query(
            "SELECT 1 FROM favorites WHERE userId = ? AND eventId = ?",
            [userId, eventId]
        );

        return NextResponse.json({ isFavorited: rows.length > 0 });
    } catch (error: any) {
        console.error("Error checking favorite:", error);
        return NextResponse.json({ error: "Failed to check favorite" }, { status: 500 });
    }
}
