import { cn, formatDate } from "@/lib/utils";
import { EyeIcon, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Note } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";

export type NotesTypeCard = Note;

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
      <div className="flex-between gap-3">
        <p className="startup-card_date">{formatDate(_createdAt)}</p>
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
          <EyeIcon className="size-4 text-blue-600" />
          <span>{views}</span>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <Link href={`/user/${author._id}`}>
            <p className="line-clamp-1 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-700">
              {author.name}
            </p>
          </Link>
          {(author.universityName || author.country) && (
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3.5 text-blue-500" />
              {author.universityName && <span>{author.universityName}</span>}
              {author.universityName && author.country && (
                <span className="mx-1">-</span>
              )}
              {author.country && <span>{author.country}</span>}
            </div>
          )}

          <Link href={`/notespage/${_id}`}>
            <h3 className="text-26-semibold mt-2 line-clamp-2 transition-colors group-hover:text-blue-700">
              {title}
            </h3>
          </Link>
        </div>
        <Link href={`/user/${author._id}`}>
          <Image
            src={author.image || "/window.svg"}
            alt={author.name}
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-white object-cover shadow-md shadow-blue-950/10"
          />
        </Link>
      </div>

      <Link href={`/notespage/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={image}
            alt={title}
            className="startup-card_img transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/?query=${category.toLowerCase()}`}>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
            <FileText className="size-4" />
            {category}
          </p>
        </Link>
        {isOwner && status && <StatusBadge status={status} />}
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
