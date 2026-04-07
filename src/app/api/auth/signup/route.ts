import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Signup } from '@/lib/models/Signup';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await Signup.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const newUser = await Signup.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: 'Signup successful', user: { id: newUser._id, email: newUser.email, name: newUser.name } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
