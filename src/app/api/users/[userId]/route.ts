import { NextResponse } from 'next/server';

const MOCK_USER = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '+919876543210',
    bio: 'Love tech and events!',
    role: 'user'
};

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    return NextResponse.json({ ...MOCK_USER, id: params.userId });
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
    return NextResponse.json({ success: true, message: 'Profile updated (mock)' });
}
