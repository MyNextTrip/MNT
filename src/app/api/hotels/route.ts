import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Intercept Next.js Native Server URL blocks for Search Query Parameters
    const { searchParams } = new URL(request.url);
    const locationQuery = searchParams.get('location');
    const searchQuery = searchParams.get('q');
    const showAll = searchParams.get('all');

    let query: any = {};
    
    // If 'all' is passed, return everything (priority)
    if (showAll === 'true') {
      const hotels = await Hotel.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, hotels }, { status: 200 });
    }

    // If no search params provided and not requesting all, return empty
    if (!locationQuery && !searchQuery) {
      return NextResponse.json({ success: true, hotels: [] }, { status: 200 });
    }

    if (searchQuery) {
      query.$or = [
        { hotelName: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { whatsappNumber: { $regex: searchQuery, $options: 'i' } },
        { ownerMobNo: { $regex: searchQuery, $options: 'i' } }
      ];
    } else if (locationQuery) {
      query.$or = [
        { location: { $regex: locationQuery, $options: 'i' } },
        { address: { $regex: locationQuery, $options: 'i' } }
      ];
    }

    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, hotels }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching global hotels payload:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
