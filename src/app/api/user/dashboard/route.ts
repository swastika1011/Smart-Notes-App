import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Note from '@/models/Note';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's notes
    const notes = await Note.find({ uploaderId: decoded.userId })
      .sort({ createdAt: -1 });
    
    // Calculate total stats
    const totalViews = notes.reduce((sum, note) => sum + note.views, 0);
    const totalDownloads = notes.reduce((sum, note) => sum + note.downloads, 0);
    
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
      },
      notes,
      stats: {
        totalNotes: notes.length,
        totalViews,
        totalDownloads,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 