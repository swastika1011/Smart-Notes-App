# Backend Model Reference

These fields were recovered from the old Sanity schemas and translated into MongoDB/Mongoose-friendly shapes.

## User / Author

Original Sanity document: `author`

Suggested MongoDB fields:

```ts
{
  name: string;
  username: string;
  email: string;
  password?: string; // hashed password for JWT auth
  image?: string;
  bio?: string;
  country?: string;
  universityName?: string;
  points?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

Notes:
- Old `id` was the GitHub OAuth id. You probably do not need it for email/password JWT auth.
- Add `password` for your new JWT login flow.
- Add `points` if you still want the earn-points feature.

## Note

Original Sanity document: `notes`

Suggested MongoDB fields:

```ts
{
  title: string;
  slug: string;
  author: ObjectId; // ref: "User"
  views: number;
  description: string;
  category: string;
  image: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  status: "pending" | "approved" | "rejected";
  aiReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

Notes:
- Old Sanity `file.asset.url` becomes a plain `fileUrl`.
- `status` default should be `"pending"`.
- `views` default should be `0`.
- `category` was required and limited to 1-20 characters.
- `image` and file upload were required.

## Example Mongoose Models

```ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,
    bio: String,
    country: String,
    universityName: String,
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: { type: Number, default: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true, minlength: 1, maxlength: 20 },
    image: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: String,
    fileType: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    aiReason: String,
  },
  { timestamps: true },
);

export const Note =
  mongoose.models.Note || mongoose.model("Note", noteSchema);
```

## Old Query Behavior To Recreate

- Home page notes:
  - Sort by newest first.
  - Search by `title`, `category`, `author.name`, `author.country`, or `author.universityName`.
- Note details:
  - Fetch one note by id.
  - Include author name, username, image, and bio.
- User profile:
  - Fetch one user by id.
  - Fetch all notes by that user, newest first.
- Views:
  - Fetch note view count.
  - Increment views after a detail page is opened.
