import React from "react";
import NotesCard, { NotesTypeCard } from "./NotesCard";
import { getNotesByAuthor } from "@/lib/notes-data";
import { getCurrentUser } from "@/lib/auth";

const UserNotes = async ({ id }: { id: string }) => {
  const currentUser = await getCurrentUser();
  const currentUserId =
    currentUser && typeof currentUser === "object" && "userId" in currentUser
      ? String(currentUser.userId)
      : undefined;
  const resources = await getNotesByAuthor(id);

  return (
    <>
      {resources.length > 0 ? (
        resources.map((notes: NotesTypeCard) => (
          <NotesCard
            key={notes._id}
            post={notes}
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};

export default UserNotes;
