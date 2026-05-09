import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Staff from '@/models/Staff';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const data = await request.json();
    const staff = await Staff.findByIdAndUpdate(id, data, { new: true });
    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Staff member removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
