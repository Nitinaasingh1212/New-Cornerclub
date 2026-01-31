import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
    try {
        const [rows]: any = await pool.query("SELECT title, city, status, date FROM events WHERE status = 'approved' ORDER BY date ASC");
        const lines = rows.map((r: any) => `${r.title} | ${r.city} | ${r.status} | ${r.date}`).join('\n');
        return new Response(lines, { headers: { 'Content-Type': 'text/plain' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
