import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Intercept Next.js Native Server URL blocks for Search Query Parameters
    const { searchParams } = new URL(request.url);
    const locationQuery = searchParams.get('location');

    let query = {};
    if (locationQuery) {
      // Execute a case-insensitive RegEx search natively against MongoDB collections mapping either pure Location or Full Address footprints
      query = {
        $or: [
          { location: { $regex: locationQuery, $options: 'i' } },
          { address: { $regex: locationQuery, $options: 'i' } }
        ]
      };
    }

    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, hotels }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching global hotels payload:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
