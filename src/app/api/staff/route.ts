import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Staff from '@/models/Staff';

export async function GET() {
  await dbConnect();
  try {
    const staff = await Staff.find({}).sort({ createdAt: -1 });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.phone || !data.code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const staff = await Staff.create(data);
    return NextResponse.json(staff, { status: 201 });
  } catch (error: any) {
    console.error("Staff creation error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Staff code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
