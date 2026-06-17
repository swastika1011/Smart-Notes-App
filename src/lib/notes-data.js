import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";
import { User } from "@/models/user";
import cloudinary from "@/lib/cloudinary/cloudinary";

function serializeNote(note) {
  return {
    _id: note._id.toString(),
    _createdAt: note.createdAt?.toISOString() || new Date().toISOString(),
    title: note.title,
    description: note.description,
    category: note.category,
    image: note.image,
    views: note.views || 0,
    author: {
      _id: note.author?._id?.toString() || "",
      name: note.author?.name || "Unknown User",
      username: note.author?.username || "unknown",
      image: note.author?.image || "/window.svg",
      bio: note.author?.bio || "",
      country: note.author?.country || "",
      universityName: note.author?.universityName || "",
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

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      }
    : {};

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
