import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
    try {
        const { amount, currency, userId, eventId } = await request.json();

        // Simulate Razorpay Order ID for now since we don't have keys in env
        // In real impl, you'd call Razorpay.orders.create here
        const orderId = `order_${Date.now()}`;

        const connection = await pool.getConnection();

        try {
            await connection.query(
                "INSERT INTO orders (id, amount, currency, status, userId, eventId) VALUES (?, ?, ?, 'created', ?, ?)",
                [orderId, amount, currency || 'INR', userId, eventId]
            );
        } finally {
            connection.release();
        }

        return NextResponse.json({
            id: orderId,
            currency: currency || 'INR',
            amount: amount
        });

    } catch (error: any) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
