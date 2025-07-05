import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password, name } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 