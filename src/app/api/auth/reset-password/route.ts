import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Signup } from '@/lib/models/Signup';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await Signup.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
