import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Signup } from '@/lib/models/Signup';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const hotelId = params.id;

    await connectToDatabase();

    const admin = await Signup.findOne({ hotelId, role: 'hotel_admin' });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'No admin credentials found for this hotel' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      credentials: { email: admin.email, password: admin.password } 
    });

  } catch (error: any) {
    console.error('Error fetching hotel credentials:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const hotelId = params.id;
    const { email: manualEmail, password: manualPassword } = await req.json().catch(() => ({}));

    await connectToDatabase();

    // Verify hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    // Check if hotel_admin already exists
    let admin = await Signup.findOne({ hotelId, role: 'hotel_admin' });

    if (!admin) {
      // Use manual credentials if provided, else auto-generate
      const slug = hotel.hotelName.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
      const shortId = hotelId.substring(hotelId.length - 4);
      
      const email = manualEmail || `hotel_${slug}_${shortId}@nextmytrip.com`;
      const password = manualPassword || Math.random().toString(36).slice(-8);

      admin = await Signup.create({
        name: `${hotel.hotelName} Admin`,
        email,
        password,
        role: 'hotel_admin',
        hotelId
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Credentials generated successfully', 
        credentials: { email, password } 
      });
    }

    // If manual credentials provided for existing admin, update them
    if (manualEmail || manualPassword) {
        admin.email = manualEmail || admin.email;
        admin.password = manualPassword || admin.password;
        await admin.save();
        
        return NextResponse.json({ 
            success: true, 
            message: 'Credentials updated successfully', 
            credentials: { email: admin.email, password: admin.password } 
        });
    }

    // Return existing credentials (passwords are currently plain text in this project)
    return NextResponse.json({ 
      success: true, 
      message: 'Credentials already exist', 
      credentials: { email: admin.email, password: admin.password } 
    });

  } catch (error: any) {
    console.error('Error generating hotel credentials:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
