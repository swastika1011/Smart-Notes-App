import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { verifyToken } from '@/lib/auth';
import { validateNoteContent } from '@/lib/ai-validation';
import { addPointsToUser, POINTS } from '@/lib/points';

export async function POST(request: NextRequest) {
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
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const topicTitle = formData.get('topicTitle') as string;
    const country = formData.get('country') as string;
    const university = formData.get('university') as string;
    const subjectTag = formData.get('subjectTag') as string;
    const description = formData.get('description') as string;
    
    // Validate required fields
    if (!file || !topicTitle || !country || !university) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer for AI validation
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // AI validation
    const validation = await validateNoteContent(topicTitle, fileBuffer);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }
    
    // Simulate file upload (in real app, upload to cloud storage)
    const fileName = `${Date.now()}-${file.name}`;
    const fileUrl = `/uploads/${fileName}`;
    
    // Save note to database
    const note = await Note.create({
      uploaderId: decoded.userId,
      topicTitle,
      country,
      university,
      subjectTag,
      description,
      fileUrl,
      fileName,
      isApproved: true, // Auto-approved after AI validation
    });
    
    // Add points to user
    await addPointsToUser(decoded.userId, POINTS.NOTE_ACCEPTED);
    
    return NextResponse.json({
      message: 'Note uploaded successfully',
      note: {
        id: note._id,
        topicTitle: note.topicTitle,
        country: note.country,
        university: note.university,
        isApproved: note.isApproved,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 