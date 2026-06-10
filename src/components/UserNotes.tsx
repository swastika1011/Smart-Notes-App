import React from "react";
import NotesCard, { NotesTypeCard } from "./NotesCard";
import { getNotesByAuthor } from "@/lib/mock-data";

const UserNotes = async ({ id }: { id: string }) => {
  const resources = getNotesByAuthor(id);

  return (
    <>
      {resources.length > 0 ? (
        resources.map((notes: NotesTypeCard) => (
          <NotesCard key={notes._id} post={notes} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};

export default UserNotes;
