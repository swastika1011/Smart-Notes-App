import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Note } from "@/lib/mock-data";
import DeleteNoteButton from "@/components/DeleteNoteButton";

export type NotesTypeCard = Note;

const statusClasses: Record<string, string> = {
  approved: "bg-green-100 text-green-900 border-green-600",
  rejected: "bg-red-100 text-red-900 border-red-600",
  processing_failed: "bg-zinc-100 text-zinc-800 border-zinc-500",
};

const NotesCard = ({
  post,
  currentUserId,
}: {
  post: NotesTypeCard;
  currentUserId?: string;
}) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    status,
  } = post;
  const isOwner = currentUserId === author._id;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
          {isOwner && <DeleteNoteButton noteId={_id} />}
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author._id}`}>
            <p className="text-16-medium line-clamp-1">{author.name}</p>
          </Link>
          {(author.universityName || author.country) && (
            <div className="mt-1 text-14-regular text-muted-foreground">
              {author.universityName && <span>{author.universityName}</span>}
              {author.universityName && author.country && (
                <span className="mx-1">-</span>
              )}
              {author.country && <span>{author.country}</span>}
            </div>
          )}

          <Link href={`/notespage/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author._id}`}>
          <Image
            src={author.image || "/window.svg"}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/notespage/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <img src={image} alt={title} className="startup-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        {isOwner && status && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClasses[status]}`}
          >
            {status.replace(/_/g, " ")}
          </span>
        )}
        <Button className="startup-card_btn" asChild>
          <Link href={`/notespage/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default NotesCard;
