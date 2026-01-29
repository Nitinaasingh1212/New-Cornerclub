import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = await params;
        const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);

        if (rows.length > 0) {
            return NextResponse.json(rows[0]);
        } else {
            return NextResponse.json({ id: userId }, { status: 404 });
        }
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = await params;
        const { name, email, phone, bio, city, profileImage, portfolio, instagram, facebook, youtube } = await request.json();

        const query = `
      INSERT INTO users (id, name, email, phone, bio, city, profileImage, portfolio, instagram, facebook, youtube)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      name = IFNULL(?, name), 
      email = IFNULL(?, email), 
      phone = IFNULL(?, phone), 
      bio = IFNULL(?, bio), 
      city = IFNULL(?, city), 
      profileImage = IFNULL(?, profileImage), 
      portfolio = IFNULL(?, portfolio), 
      instagram = IFNULL(?, instagram), 
      facebook = IFNULL(?, facebook), 
      youtube = IFNULL(?, youtube)
    `;

        const portfolioJson = portfolio ? JSON.stringify(portfolio) : null;

        await pool.query(query, [
            userId, name || null, email || null, phone || null, bio || null, city || null, profileImage || null, portfolioJson, instagram || null, facebook || null, youtube || null,
            name || null, email || null, phone || null, bio || null, city || null, profileImage || null, portfolioJson, instagram || null, facebook || null, youtube || null
        ]);

        return NextResponse.json({ success: true, message: "Profile updated" });
    } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 });
    }
}
