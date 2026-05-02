import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Signup } from '@/lib/models/Signup';
import { compare, hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Root Admin Intercept
    if (email === process.env.ROOT_ADMIN && password === process.env.ROOT_PASS) {
      return NextResponse.json(
        { message: 'Root authentication successful', user: { id: 'root-admin', email, name: 'Root Administrator', role: 'admin' } },
        { status: 200 }
      );
    }

    await connectToDatabase();

    const user = await Signup.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    let isPasswordValid = await compare(password, user.password);
    
    // Backward compatibility for plain text passwords
    if (!isPasswordValid && user.password === password) {
      isPasswordValid = true;
      // Auto-migrate to hashed password
      user.password = await hash(password, 10);
      user.vPass = password;
      await user.save();
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Login successful', 
        user: { 
          id: user._id, 
          email: user.email, 
          name: user.name,
          role: user.role || 'user',
          hotelId: user.hotelId || null
        } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
