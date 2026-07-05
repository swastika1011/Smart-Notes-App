import Link from "next/link";
import SearchForm from "@/components/SearchForm";
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
<section className="min-h-[75vh] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
          <div className="grid min-h-[80vh] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">


              <h1 className="font-heading text-4xl font-bold leading-[1.05] text-[#0A1F44] sm:text-5xl lg:text-6xl">
                Share Knowledge.
                <br />
                Learn Smarter.
              </h1>

              <p className="font-body mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Share high-quality study materials with confidence.
              </p>

              <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <Link
                  href="/notespage/create"
                  className="font-body rounded-xl bg-[#0A1F44] px-6 py-3 text-center font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12366f]"
                >
                  Upload Notes
                </Link>
                <Link
                  href="#notes"
                  className="font-body rounded-xl border border-slate-300 bg-white/70 px-6 py-3 text-center font-medium text-[#0A1F44] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
                >
                  Browse Notes
                </Link>
              </div>

              <div className="mb-10 mt-8 w-full max-w-lg lg:mb-0">
                <SearchForm query={query} />
              </div>
            </div>

            <div className="font-body mb-10 flex justify-center md:mb-0">
            <div className="mx-auto flex w-full max-w-[380px] flex-col rounded-3xl border border-white/50 bg-white/70 p-8 lg:min-h-[420px] shadow-xl shadow-blue-950/10 backdrop-blur-md">                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    AI Powered
                  </span>

                  <h3 className="mt-5 font-heading text-3xl font-bold text-[#0A1F44]">
                    Smart Note Review
                  </h3>

                  <p className="mt-3 leading-relaxed text-slate-600">
                    Every uploaded note is automatically reviewed for relevance,
                    quality, and topic accuracy before it is shared with students.
                  </p>
                </div>

                <div className="space-y-3 lg:mt-5 lg:space-y-5">
                  {[
                    "Topic Match Verification",
                    "Content Quality Check",
                    "Safe Learning Material",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className="text-blue-700">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="notes" className="section_container font-body scroll-mt-24">
        <p className="text-sm font-semibold text-blue-700">
          {query ? `Search results for "${query}"` : "All Notes"}
        </p>

        <ul className="card_grid mt-7">
          {posts.length > 0 ? (
            posts.map((post: NotesTypeCard) => (
              <NotesCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <p className="no-result">No relevant notes found</p>
          )}
        </ul>
      </section>
    </>
  );
}

export default Home;
