"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function LikeButton({
  noteId,
  initialLiked,
  initialCount,
  disabled,
}: {
  noteId: string;
  initialLiked: boolean;
  initialCount: number;
  disabled?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  async function toggleLike() {
    if (disabled) {
      toast.error("Please log in to like notes");
      return;
    }

    try {
      setIsPending(true);

      const response = await fetch(`/api/notes/${noteId}/like`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update like");
        return;
      }

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      toast.error("Failed to update like");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleLike}
      disabled={isPending}
      className="gap-2 border-[3px] border-black rounded-full"
      aria-pressed={liked}
    >
      <Heart
        className={`size-5 ${liked ? "fill-red-500 text-red-500" : "text-black"}`}
      />
      {likeCount}
    </Button>
  );
}
