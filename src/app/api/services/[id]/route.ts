import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Service from '@/models/Service';

type Params = Promise<{ id: string }>;

export async function PUT(req: Request, segmentData: { params: Params }) {
  try {
    const body = await req.json();
    await connectToDatabase();
    
    const params = await segmentData.params;
    
    const service = await Service.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    await connectToDatabase();
    const params = await segmentData.params;
    const service = await Service.findByIdAndDelete(params.id);
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
