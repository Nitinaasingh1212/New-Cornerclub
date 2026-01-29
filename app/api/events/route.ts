import { NextResponse } from 'next/server';

const MOCK_EVENTS = [
    {
        id: 'mock-1',
        title: 'Corner Club Grand Opening',
        description: 'Join us for the grand opening of Corner Club! Meet new people and enjoy the vibe.',
        date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        location: 'Cyber Hub, Gurgaon',
        city: 'Gurgaon',
        category: 'Social',
        price: 0,
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        organizer: { name: 'Corner Team' },
        status: 'approved',
        attendees: 120,
        capacity: 200
    },
    {
        id: 'mock-2',
        title: 'Tech Networking Night',
        description: 'Connect with tech enthusiasts and founders in your city.',
        date: new Date(Date.now() + 86400000 * 5).toISOString(),
        location: 'WeWork, Bangalore',
        city: 'Bangalore',
        category: 'Networking',
        price: 500,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        organizer: { name: 'Tech Bangalore' },
        status: 'approved',
        attendees: 45,
        capacity: 100
    }
];

export async function GET() {
    return NextResponse.json(MOCK_EVENTS);
}
