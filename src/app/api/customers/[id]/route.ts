import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Customer from '@/models/Customer';
import Appointment from '@/models/Appointment';
import Invoice from '@/models/Invoice';

type Params = Promise<{ id: string }>;

export async function GET(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    await connectToDatabase();
    const { id } = await segmentData.params;
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Fetch visit and billing history
    const [appointments, invoices] = await Promise.all([
      Appointment.find({ customer: id }).sort({ startTime: -1 }).limit(10),
      Invoice.find({ customer: id }).sort({ createdAt: -1 }).limit(10)
    ]);

    return NextResponse.json({
      customer,
      history: {
        appointments,
        invoices
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    const data = await request.json();
    await connectToDatabase();
    const { id } = await segmentData.params;
    
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Phone number or membership number already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    await connectToDatabase();
    const { id } = await segmentData.params;
    const customer = await Customer.findByIdAndDelete(id);
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
