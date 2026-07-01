/* 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

const DeleteNoteButton = ({ noteId }: { noteId: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm("Delete this note?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete note");
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete note"
      className="w-6 h-6 rounded-full flex justify-center items-center hover:bg-gray-500 disabled:opacity-50"
    >
      <RxCross2 className="text-black text-xl" />
    </button>
  );
};

export default DeleteNoteButton;
*/
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const DeleteNoteButton = ({ noteId }: { noteId: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete note");
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
    >
      <Trash2 className="size-4" />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteNoteButton;
