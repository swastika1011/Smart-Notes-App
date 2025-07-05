import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { addPointsToUser, POINTS } from '@/lib/points';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const noteId = params.id;
    
    // Find and update note
    const note = await Note.findById(noteId);
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Increment downloads
    note.downloads += 1;
    await note.save();
    
    // Add points to uploader
    await addPointsToUser(note.uploaderId.toString(), POINTS.NOTE_DOWNLOADED);
    
    return NextResponse.json({
      message: 'Download recorded',
      downloads: note.downloads,
      fileUrl: note.fileUrl,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 