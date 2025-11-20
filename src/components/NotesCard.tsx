import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// import { Author,Notes } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";
import type { NOTES_QUERYResult } from "@/sanity/types";
export type NotesTypeCard = NOTES_QUERYResult[number];


// export type NotesTypeCard = Omit<Notes, "author"> & { author?: Author };

const NotesCard = ({ post }: { post: NotesTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
{(author?.universityName || author?.country) && (
  <div className="mt-1 text-14-regular text-muted-foreground">
    {author?.universityName && <span>{author.universityName}</span>}
    {author?.universityName && author?.country && <span className="mx-1">•</span>}
    {author?.country && <span>{author.country}</span>}
  </div>
)}

          <Link href={`/notespage/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image
            
  src="https://images.unsplash.com/photo-1752035197224-6e6bdc4f7fb1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/notespage/${_id}`}>
        <p className="startup-card_desc">{description}</p>

        <img src={image} alt="placeholder" className="startup-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
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