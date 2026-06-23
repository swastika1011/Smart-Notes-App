import { notFound } from "next/navigation";
import { Suspense } from "react";
export const experimental_ppr = true;
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import View from "@/components/View";
import { getNoteById } from "@/lib/notes-data";
import { getCurrentUser } from "@/lib/auth";

const statusClasses: Record<string, string> = {
  approved: "bg-green-100 text-green-900 border-green-600",
  rejected: "bg-red-100 text-red-900 border-red-600",
  processing_failed: "bg-zinc-100 text-zinc-800 border-zinc-500",
};

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, currentUser] = await Promise.all([
    getNoteById(id),
    getCurrentUser(),
  ]);

  if (!post) return notFound();

  const currentUserId = currentUser?.userId ? String(currentUser.userId) : "";
  const isOwner = currentUserId === post.author._id;
  const status = post.status || "processing_failed";
  const isRejected = status === "rejected";
  const canEdit = isOwner && ["approved", "rejected", "processing_failed"].includes(status);
  const hasLiked = Boolean(post.likes?.includes(currentUserId));
  const pdfViewUrl = `/api/notes/${post._id}/pdf`;
  const pdfDownloadUrl = `${pdfViewUrl}?download=1`;

  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full max-h-[460px] object-cover rounded-xl border-[4px] border-black"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5 max-md:flex-col max-md:items-start">
            <Link
              href={`/user/${post.author._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image || "/window.svg"}
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

          <div className="flex flex-wrap items-center gap-3">
            <LikeButton
              noteId={post._id}
              initialLiked={hasLiked}
              initialCount={post.likeCount || 0}
              disabled={!currentUserId}
            />
            <p className="text-sm text-zinc-600">
              Created {formatDate(post._createdAt)}
            </p>
            {isOwner && (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold capitalize ${statusClasses[status]}`}
              >
                {status.replace(/_/g, " ")}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-30-bold">Description</h3>
            <p className="mt-3 text-lg leading-8 text-zinc-700">
              {post.description}
            </p>
          </div>

          {isOwner && isRejected && (
            <div className="rounded-lg border-[3px] border-red-600 bg-red-50 p-4">
              <p className="font-bold text-red-800">Review reason</p>
              <p className="mt-1 text-red-700">
                {post.reviewReason || "No reason provided."}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {post.file?.asset?.url && (
              <Button className="startup-card_btn" asChild>
                <a href={pdfDownloadUrl} download>
                  Download PDF
                </a>
              </Button>
            )}

            {isOwner && (
              <Button
                className="startup-card_btn disabled:opacity-50"
                disabled={!canEdit}
                asChild={canEdit}
              >
                {canEdit ? (
                  <Link href={`/notespage/${post._id}/edit`}>
                    {isRejected ? "Edit & Resubmit" : "Edit Note"}
                  </Link>
                ) : (
                  <span>Edit Disabled</span>
                )}
              </Button>
            )}
          </div>

          {post.file?.asset?.url && (
            <div className="mt-8">
              <h3 className="text-30-bold mb-4">PDF Viewer</h3>
              <iframe
                src={pdfViewUrl}
                title={`${post.title} PDF`}
                className="h-[720px] w-full rounded-lg border-[4px] border-black bg-white"
              />
            </div>
          )}
        </div>

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}
