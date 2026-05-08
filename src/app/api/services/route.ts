import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectToDatabase();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
