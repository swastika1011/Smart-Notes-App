import { notFound } from "next/navigation";
import Image from "next/image";
import UserNotes from "@/components/UserNotes";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/NotesCard";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";

type ProfileUser = {
  name: string;
  username: string;
  image?: string;
  profileImage?: string;
  bio?: string;
  country?: string;
  university?: string;
  universityName?: string;
  github?: string;
  linkedin?: string;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  await connectDB();

  const user = (await User.findById(id)
    .select("-password")
    .lean()) as ProfileUser | null;

  if (!user) return notFound();

return(
  <main
    className="
      min-h-screen 
    "
  >
<section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-14 lg:pb-32">
<div className="grid items-start gap-16 lg:grid-cols-[300px_minmax(0,1fr)]">        {/* LEFT PROFILE */}
<aside
  className="
    relative
    rounded-3xl
    border
    border-white/60
    bg-white/70
    backdrop-blur-md
    shadow-xl
    p-8
    text-center
  "
>
          <Image
            src={user.profileImage || user.image || "/window.svg"}
            alt={user.name}
            width={130}
            height={130}
            className="
              mx-auto
              h-32
              w-32
              rounded-full
              object-cover
              border-4
              border-white
              shadow-lg
            "
          />

          <h1 className="mt-5 font-heading text-4xl text-[#0A1F44]">
            {user.name}
          </h1>

          <p className="mt-2 font-body text-slate-500">
            @{user.username}
          </p>

          <div
            className="
              mt-5
              inline-flex
              rounded-full
              bg-blue-50
              px-4
              py-2
              text-sm
              font-medium
              text-blue-700
            "
          >
            ✨ AI Verified Contributor
          </div>

          <p className="mt-6 font-body leading-relaxed text-slate-600">
            {user.bio || "Passionate about sharing quality study materials."}
          </p>

          <div className="my-8 h-px bg-slate-200" />

          <div className="space-y-5 text-left">

            {(user.university || user.universityName) && (
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  University
                </p>

                <p className="mt-1 font-body text-slate-700">
                  {user.university || user.universityName}
                </p>
              </div>
            )}

            {user.country && (
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Country
                </p>

                <p className="mt-1 font-body text-slate-700">
                  {user.country}
                </p>
              </div>
            )}
          </div>

          {(user.github || user.linkedin) && (
            <>
              <div className="my-8 h-px bg-slate-200" />

              <div className="flex justify-center gap-3">

                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-2
                      hover:bg-slate-100
                      transition
                    "
                  >
                    GitHub
                  </a>
                )}

                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-2
                      hover:bg-slate-100
                      transition
                    "
                  >
                    LinkedIn
                  </a>
                )}

              </div>
            </>
          )}
        </aside>

        {/* RIGHT */}
        <div className="space-y-8">

          <div>

<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#0A1F44]">              Shared Notes
            </h2>

            <p className="mt-2 font-body text-lg text-slate-500">
              Notes published by @{user.username}
            </p>

          </div>

          <ul className="card_grid-sm ">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserNotes id={id} />
            </Suspense>
          </ul>

        </div>

      </div>
    </section>
    <div className="h-24 lg:h-32" />
  </main>
);

};

export default Page;
