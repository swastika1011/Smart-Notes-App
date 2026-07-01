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
import StatusBadge from "@/components/StatusBadge";
import { getNoteById } from "@/lib/notes-data";
import { getCurrentUser } from "@/lib/auth";
import { incrementNoteViews } from "@/lib/notes-data";

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

const views = await incrementNoteViews(
  id,
  currentUser?.userId
);

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
        <p className="tag -translate-y-10">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
  <img
    src={post.image}
    alt="thumbnail"
    className="mx-auto w-full max-w-5xl h-[250px] sm:h-[320px] lg:h-[400px] rounded-3xl border border-white/70 object-cover shadow-xl shadow-blue-950/10"
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
                width={40}
                height={40}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium !text-[#0A1F44]">{post.author.name}</p>
                <p className="text-16-medium !text-blue-500">
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
              <StatusBadge status={status} className="text-sm" />
            )}
          </div>

          <div>
            <h3 className="text-30-bold">Description</h3>
            <p className="mt-3 text-lg leading-8 text-zinc-700">
              {post.description}
            </p>
          </div>

          {isOwner && isRejected && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5">
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
                className="h-[720px] w-full rounded-3xl border border-white/70 bg-white shadow-xl shadow-blue-950/10"
              />
            </div>
          )}
        </div>

      <View totalViews={views} />
      </section>
    </>
  );
}
