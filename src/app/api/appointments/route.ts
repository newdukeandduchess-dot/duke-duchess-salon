import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Appointment from '@/models/Appointment';
import '@/models/Customer'; // Ensure models are registered for population
import '@/models/Service';
import '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const date = searchParams.get('date');
    const staffId = searchParams.get('staffId');

    let query: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    if (staffId) {
      query.staff = staffId;
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'name phone')
      .populate('staff', 'name')
      .populate('services', 'name price duration')
      .sort({ startTime: 1 });

    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();
    
    // Calculate total if not provided
    // In a real app, you'd fetch service prices here
    
    const appointment = await Appointment.create(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
