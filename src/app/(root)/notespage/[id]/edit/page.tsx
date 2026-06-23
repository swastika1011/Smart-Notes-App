import { notFound, redirect } from "next/navigation";
import EditNoteForm from "@/components/EditNoteForm";
import { getCurrentUser } from "@/lib/auth";
import { getNoteById } from "@/lib/notes-data";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.userId) {
    redirect("/login");
  }

  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  if (note.author._id !== currentUser.userId) {
    redirect(`/notespage/${id}`);
  }

  if (!["approved", "rejected"].includes(note.status || "")) {
    redirect(`/notespage/${id}`);
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Edit & Resubmit</h1>
        <p className="sub-heading !max-w-3xl">
          Your note will return to review after saving.
        </p>
      </section>
      <EditNoteForm note={note} />
    </>
  );
}
