import SearchForm from "@/components/SearchForm";
import React from "react";
import NotesCard, { NotesTypeCard } from "@/components/NotesCard";
import { getNotes } from "@/lib/notes-data";
import { getCurrentUser } from "@/lib/auth";

async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const currentUser = await getCurrentUser();
  const currentUserId =
    currentUser && typeof currentUser === "object" && "userId" in currentUser
      ? String(currentUser.userId)
      : undefined;
  const posts = await getNotes(query || null);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Share Your Notes, <br /> With The Students All Around The World
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Notes, Like the Helpful Notes And Earn Points
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : " All Notes"}
        </p>

        <ul className="mt-7 card_grid">
          {posts.length > 0 ? (
            posts.map((post: NotesTypeCard) => (
              <NotesCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <p className="no-results">No relevant notes found</p>
          )}
        </ul>
      </section>
    </>
  );
}

export default Home;
