
import SearchForm from "@/components/SearchForm";
import React from "react";
import { NOTES_QUERY } from "@/sanity/lib/queries";
// import { NOTES_QUERYResult } from "@/sanity/types";
import NotesCard, {NotesTypeCard} from "@/components/NotesCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import {auth} from "@/auth";
// type NotesTypeCard = NOTES_QUERYResult[number];

async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = {search: query || null};
  const session = await auth();
  // console.log(session?.id);

  const {data: posts} = await sanityFetch( { query: NOTES_QUERY, params });
  // console.log(JSON.stringify(posts));


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
          {posts?.length > 0 ? (
            posts.map((post: NotesTypeCard) => (
              <NotesCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No relevent notes found</p>
          )}
        </ul>
      </section>
      <SanityLive />

    </>
  );
}

export default Home;
