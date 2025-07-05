import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const country = searchParams.get('country');
    const university = searchParams.get('university');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query
    const query: any = { isApproved: true };
    
    if (search) {
      query.topicTitle = { $regex: search, $options: 'i' };
    }
    
    if (country) {
      query.country = country;
    }
    
    if (university) {
      query.university = { $regex: university, $options: 'i' };
    }
    
    // Build sort object
    const sort: any = {};
    if (sortBy === 'popularity') {
      sort.views = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    
    const notes = await Note.find(query)
      .populate('uploaderId', 'name')
      .sort(sort)
      .limit(50);
    
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Fetch notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 