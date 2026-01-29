import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string, eventId: string } }) {
    return NextResponse.json({ isFavorited: false });
}
