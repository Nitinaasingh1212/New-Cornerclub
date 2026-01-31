import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
    let connection;
    try {
        const { eventId, userId, userDetails, quantity, paymentDetails } = await request.json();

        if (!eventId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check capacity
        const [events]: any = await connection.query("SELECT attendees, capacity FROM events WHERE id = ? FOR UPDATE", [eventId]);
        if (events.length === 0) throw new Error("Event not found");

        const event = events[0];
        if (event.attendees + quantity > event.capacity) {
            throw new Error("Event is full or not enough spots left");
        }

        // Create booking
        await connection.query(
            "INSERT INTO bookings (eventId, userId, userDetails, quantity, paymentDetails, status) VALUES (?, ?, ?, ?, ?, 'confirmed')",
            [eventId, userId, JSON.stringify(userDetails), quantity, JSON.stringify(paymentDetails)]
        );

        // Update attendees
        await connection.query("UPDATE events SET attendees = attendees + ? WHERE id = ?", [quantity, eventId]);

        await connection.commit();
        return NextResponse.json({ success: true, message: "Booking successful" });
    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: error.message || "Failed to book event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
