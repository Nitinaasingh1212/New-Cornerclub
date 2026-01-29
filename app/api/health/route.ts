import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
    try {
        // Attempt a simple query
        const [rows]: any = await pool.query('SELECT 1 as connected');

        return NextResponse.json({
            status: "online",
            database: "connected",
            message: "MySQL connection successful!"
        });
    } catch (error: any) {
        console.error("Database connection failed:", error);
        return NextResponse.json({
            status: "error",
            database: "disconnected",
            error: error.message,
            code: error.code
        }, { status: 500 });
    }
}
