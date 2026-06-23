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

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.profileImage || user.image || "/window.svg"}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user.username}
          </p>

          <p className="mt-1 text-center text-14-normal">
            {user.bio || "No bio yet"}
          </p>

          {(user.university || user.universityName || user.country) && (
            <p className="mt-4 text-center text-sm text-white-100-alpha">
              {[user.university || user.universityName, user.country]
                .filter(Boolean)
                .join(" - ")}
            </p>
          )}

          <div className="mt-4 flex gap-4">
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noreferrer"
                className="text-white underline"
              >
                GitHub
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-white underline"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">All Notes</p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserNotes id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
