import { NOTES_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import {Suspense} from "react";
export const experimental_ppr = true;
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

export default async function NotesPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const post = await client.fetch(NOTES_BY_ID_QUERY, { id });

  if (!post) return notFound();

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
          <p className="sub-heading !max-w-5xl">{post.description}</p>

      </section>
      <section className="section_container">
             <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Grab Your Notes Here</h3>

             {post.file?.asset?.url && (
      <a
        href={post.file.asset.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="startup-card_download-btn"
      >
        Download PDF
      </a>
    )}

          </div>

                   {/* Download PDF Button */}
 
              {/* <hr className="divider" /> */}

              <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}
