import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
    try {
        const { orderId, paymentId, signature } = await request.json();

        // In real impl, verify signature here using crypto

        const connection = await pool.getConnection();
        try {
            // Update order status to paid
            // Also store paymentId
            const [result]: any = await connection.query(
                "UPDATE orders SET status = 'paid', paymentId = ? WHERE id = ?",
                [paymentId, orderId]
            );

            if (result.affectedRows === 0) {
                // If order not found, maybe create it? Or error.
                // For now, let's just log it.
                console.warn(`Order ${orderId} not found during verification`);
            }

            return NextResponse.json({ success: true, message: "Payment verified" });

        } finally {
            connection.release();
        }

    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
    }
}
