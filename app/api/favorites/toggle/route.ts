import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
    try {
        const { userId, eventId } = await request.json();

        if (!userId || !eventId) {
            return NextResponse.json({ error: "Missing userId or eventId" }, { status: 400 });
        }

        // Check if already favorited
        const [existing]: any = await pool.query(
            "SELECT * FROM favorites WHERE userId = ? AND eventId = ?",
            [userId, eventId]
        );

        if (existing.length > 0) {
            // Remove from favorites
            await pool.query(
                "DELETE FROM favorites WHERE userId = ? AND eventId = ?",
                [userId, eventId]
            );
            return NextResponse.json({ added: false, message: "Removed from favorites" });
        } else {
            // Add to favorites
            await pool.query(
                "INSERT INTO favorites (userId, eventId) VALUES (?, ?)",
                [userId, eventId]
            );
            return NextResponse.json({ added: true, message: "Added to favorites" });
        }
    } catch (error: any) {
        console.error("Error toggling favorite:", error);
        return NextResponse.json({ error: "Failed to toggle favorite", details: error.message }, { status: 500 });
    }
}
