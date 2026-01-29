import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;
        const [rows]: any = await pool.query(
            `SELECT e.* FROM events e 
       JOIN favorites f ON e.id = f.eventId 
       WHERE f.userId = ?`,
            [userId]
        );

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, eventId } = await request.json();
        const [rows]: any = await pool.query("SELECT * FROM favorites WHERE userId = ? AND eventId = ?", [userId, eventId]);

        if (rows.length > 0) {
            await pool.query("DELETE FROM favorites WHERE userId = ? AND eventId = ?", [userId, eventId]);
            return NextResponse.json({ added: false });
        } else {
            await pool.query("INSERT INTO favorites (userId, eventId) VALUES (?, ?)", [userId, eventId]);
            return NextResponse.json({ added: true });
        }
    } catch (error: any) {
        console.error("Error toggling favorite:", error);
        return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
    }
}
