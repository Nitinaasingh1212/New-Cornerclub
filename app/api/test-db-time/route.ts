import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
    try {
        const [rows]: any = await pool.query("SELECT NOW() as dbTime, UTC_TIMESTAMP() as utcTime");
        return NextResponse.json({
            ...rows[0],
            serverTime: new Date().toISOString(),
            serverLocal: new Date().toString()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
