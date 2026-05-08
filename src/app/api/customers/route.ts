import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Customer from '@/models/Customer';

export async function GET() {
  try {
    await connectToDatabase();
    const customers = await Customer.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    
    const customer = await Customer.create(data);
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Phone number or membership number already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
