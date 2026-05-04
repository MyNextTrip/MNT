import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const hotelId = params.id;
    await connectToDatabase();
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Error fetching hotel inventory:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const hotelId = params.id;
    
    // Process JSON body for Base64 image support
    const { rooms } = await req.json();

    if (!rooms) {
      return NextResponse.json({ success: false, message: 'Rooms data is required' }, { status: 400 });
    }

    await connectToDatabase();
    const hotel = await Hotel.findByIdAndUpdate(hotelId, { rooms }, { new: true });

    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Error updating hotel inventory:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
