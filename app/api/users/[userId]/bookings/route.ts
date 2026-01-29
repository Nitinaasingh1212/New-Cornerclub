import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = await params;
        const [rows]: any = await pool.query(
            `SELECT b.*, e.title as eventTitle, e.date as eventDate, e.location as eventLocation, e.image as eventImage 
       FROM bookings b 
       LEFT JOIN events e ON b.eventId = e.id 
       WHERE b.userId = ? 
       ORDER BY b.bookedAt DESC`,
            [userId]
        );

        // Format for frontend
        const enrichedBookings = rows.map((row: any) => ({
            ...row,
            event: row.eventTitle ? {
                id: row.eventId,
                title: row.eventTitle,
                date: row.eventDate,
                location: row.eventLocation,
                image: row.eventImage
            } : null
        }));

        return NextResponse.json(enrichedBookings);
    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    let connection;
    try {
        const { eventId, userId, userDetails, quantity, paymentDetails } = await request.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check capacity
        const [events]: any = await connection.query("SELECT attendees, capacity FROM events WHERE id = ? FOR UPDATE", [eventId]);
        if (events.length === 0) throw new Error("Event not found");

        const event = events[0];
        if (event.attendees + quantity > event.capacity) throw new Error("Event is full");

        // Create booking
        await connection.query(
            "INSERT INTO bookings (eventId, userId, userDetails, quantity, paymentDetails, status) VALUES (?, ?, ?, ?, ?, 'confirmed')",
            [eventId, userId, JSON.stringify(userDetails), quantity, JSON.stringify(paymentDetails)]
        );

        // Update attendees
        await connection.query("UPDATE events SET attendees = attendees + ? WHERE id = ?", [quantity, eventId]);

        await connection.commit();
        return NextResponse.json({ success: true, message: "Booking confirmed" });
    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: error.message || "Failed to book event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
