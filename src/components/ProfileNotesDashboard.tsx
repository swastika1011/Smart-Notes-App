import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Note } from "@/lib/mock-data";

const statusClasses: Record<string, string> = {
  approved: "bg-green-100 text-green-900 border-green-600",
  rejected: "bg-red-100 text-red-900 border-red-600",
  processing_failed: "bg-zinc-100 text-zinc-800 border-zinc-500",
};

function statusLabel(status?: string) {
  return (status || "processing_failed").replace(/_/g, " ");
}

export default function ProfileNotesDashboard({ notes }: { notes: Note[] }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-30-bold">My Notes</h2>
        <Link href="/notespage/create" className="startup-card_btn">
          New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="mt-5 text-sm text-zinc-600">No notes submitted yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto border-[4px] border-black rounded-lg">
          <table className="w-full min-w-[720px] bg-white text-left">
            <thead className="bg-zinc-100 border-b-[4px] border-black">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Review Reason</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => {
                const status = note.status || "processing_failed";

                return (
                  <tr key={note._id} className="border-b border-zinc-200">
                    <td className="p-4 font-semibold">
                      <Link href={`/notespage/${note._id}`} >
                        {note.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClasses[status]}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </td>
                    <td className="p-4">{formatDate(note._createdAt)}</td>
                    <td className="p-4 max-w-xs">
                      {status === "rejected"
                        ? note.reviewReason || "No reason provided"
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
