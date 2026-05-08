import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';

type Params = Promise<{ id: string }>;

export async function PUT(req: Request, segmentData: { params: Params }) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const params = await segmentData.params;
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    await connectToDatabase();
    const params = await segmentData.params;
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
