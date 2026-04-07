import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    const hotel = await Hotel.findById(id);
    
    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching single hotel:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
