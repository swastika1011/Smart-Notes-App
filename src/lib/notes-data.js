import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";
import { User } from "@/models/user";
import cloudinary from "@/lib/cloudinary/cloudinary";

function serializeNote(note) {
  const status = note.status || note.reviewStatus || "processing_failed";

  return {
    _id: note._id.toString(),
    _createdAt: note.createdAt?.toISOString() || new Date().toISOString(),
    createdAt: note.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: note.updatedAt?.toISOString() || "",
    title: note.title,
    description: note.description,
    category: note.category,
    image: note.image,
    views: note.views || 0,
    status,
    reviewReason: note.reviewReason || "",
    reviewedAt: note.reviewedAt?.toISOString() || "",
    submittedAt: note.submittedAt?.toISOString() || "",
    lastEditedAt: note.lastEditedAt?.toISOString() || "",
    extractedText: note.extractedText || "",
    likeCount: note.likeCount || note.likes?.length || 0,
    likes: (note.likes || []).map((like) => like.toString()),
    author: {
      _id: note.author?._id?.toString() || "",
      name: note.author?.name || "Unknown User",
      username: note.author?.username || "unknown",
      image: note.author?.profileImage || note.author?.image || "/window.svg",
      bio: note.author?.bio || "",
      country: note.author?.country || "",
      university: note.author?.university || note.author?.universityName || "",
      universityName: note.author?.universityName || note.author?.university || "",
      github: note.author?.github || "",
      linkedin: note.author?.linkedin || "",
      email: note.author?.email || "",
    },
    file: {
      asset: {
        url: note.fileUrl,
      },
    },
  };
}

export async function getNotes(search) {
  await connectDB();

  const approvedFilter = {
    $or: [
      { status: "approved" },
      { status: { $exists: false }, reviewStatus: "approved" },
    ],
  };
  const query = search
    ? {
        $and: [
          approvedFilter,
          {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
            ],
          },
        ],
      }
    : approvedFilter;

  const notes = await Note.find(query)
    .populate("author")
    .sort({ createdAt: -1 })
    .lean();

  return notes.map(serializeNote);
}

export async function getNoteById(id) {
  await connectDB();

  const note = await Note.findById(id).populate("author").lean();
  return note ? serializeNote(note) : null;
}

export async function getNotesByAuthor(authorId) {
  await connectDB();

  const notes = await Note.find({ author: authorId })
    .populate("author")
    .sort({ createdAt: -1 })
    .lean();

  return notes.map(serializeNote);
}

export async function getNotesByOwner(authorId) {
  await connectDB();

  const notes = await Note.find({ author: authorId })
    .populate("author")
    .sort({ createdAt: -1 })
    .lean();

  return notes.map(serializeNote);
}

export async function getNoteViews(id) {
  await connectDB();

  const note = await Note.findById(id).select("views").lean();
  return note?.views || 0;
}

export async function deleteNoteById(notesId, userId) {
  await connectDB();

  const note = await Note.findById(notesId).select("author cloudinaryId imageCloudinaryId");

  if (!note) {
    return { ok: false, status: 404, message: "Note not found" };
  }

  if (note.author.toString() !== userId) {
    return { ok: false, status: 403, message: "You can only delete your own notes" };
  }

    if (note.cloudinaryId) {
    const pdfDelete = await cloudinary.uploader.destroy(
      note.cloudinaryId,
      { resource_type: "raw" }
    );

    console.log("PDF delete:", pdfDelete);
  }
    if (note.imageCloudinaryId) {
    const imageDelete = await cloudinary.uploader.destroy(
      note.imageCloudinaryId,
      { resource_type: "image" }
    );

    console.log("Image delete:", imageDelete);
  }



  await Note.deleteOne({ _id: notesId });
  await User.findByIdAndUpdate(userId, { $pull: { posts: notesId } });

  return { ok: true, status: 200, message: "Note deleted successfully" };
}
