import React from "react";
import { client } from "@/sanity/lib/client";
import { NOTES_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import NotesCard, {NotesTypeCard} from "./NotesCard";

const UserNotes = async ({ id }: { id: string }) => {
  const resources = await client.fetch(NOTES_BY_AUTHOR_QUERY, { id });

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