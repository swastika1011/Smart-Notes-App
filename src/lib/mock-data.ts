export type Author = {
  _id: string;
  name: string;
  username: string;
  image: string;
  email?: string;
  bio?: string;
  country?: string;
  university?: string;
  universityName?: string;
  github?: string;
  linkedin?: string;
};

export type Note = {
  _id: string;
  _createdAt: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  description: string;
  category: string;
  image: string;
  views: number;
  status?: "approved" | "rejected" | "processing_failed";
  reviewReason?: string;
  reviewedAt?: string;
  submittedAt?: string;
  lastEditedAt?: string;
  extractedText?: string;
  likes?: string[];
  likeCount?: number;
  author: Author;
  file?: {
    asset?: {
      url?: string;
    };
  };
};

export const authors: Author[] = [
  {
    _id: "demo-author",
    name: "SmartNotes Demo",
    username: "smartnotes",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    bio: "Temporary local profile until Express, MongoDB, and JWT auth are connected.",
    country: "India",
    universityName: "Demo University",
  },
];

export const notes: Note[] = [
  {
    _id: "demo-note",
    _createdAt: "2026-06-10T00:00:00.000Z",
    title: "Demo Study Notes",
    description:
      "This placeholder note keeps the app usable until you connect your Express/MongoDB API later.",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    views: 128,
    author: authors[0],
    file: {
      asset: {
        url: "/sample.pdf",
      },
    },
  },
];

export function getNotes(search?: string | null) {
  if (!search) return notes;

  const query = search.toLowerCase();
  return notes.filter((note) =>
    [note.title, note.description, note.category, note.author.name]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
}

export function getNoteById(id: string) {
  return notes.find((note) => note._id === id);
}

export function getAuthorById(id: string) {
  return authors.find((author) => author._id === id);
}

export function getNotesByAuthor(authorId: string) {
  return notes.filter((note) => note.author._id === authorId);
}
