"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Note } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import {  Pencil } from "lucide-react";
import DeleteNoteButton from "@/components/DeleteNoteButton";


export default function ProfileNotesDashboard({ notes }: { notes: Note[] }) {
  const statuses = ["All", "Approved", "Pending", "Rejected", "Processing"];
  const [activeStatus, setActiveStatus] = useState("All");
  const filteredNotes = useMemo(() => {
    if (activeStatus === "All") return notes;

    return notes.filter((note) => {
      const status = note.status || "processing";
      if (activeStatus === "Processing") {
        return ["processing", "processing_failed"].includes(status);
      }

      return status === activeStatus.toLowerCase();
    });
  }, [activeStatus, notes]);

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Your uploads</p>
          <h2 className="text-30-bold">My Notes</h2>
          <p className="mt-2 text-sm text-slate-500">
            Track review status and open notes you have submitted.
          </p>
        </div>
        <Link href="/notespage/create" className="startup-card_btn inline-flex items-center gap-2">
          <Plus className="size-4" />
          New Note
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/70 p-3 shadow-lg shadow-blue-950/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-h-11 items-center gap-2 rounded-2xl border border-blue-50 bg-white/80 px-4 text-sm text-slate-500 sm:min-w-[260px]">
          <Search className="size-4 text-blue-600" />
          <span>Filter by status</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeStatus === status
                  ? "border-[#0A1F44] bg-[#0A1F44] text-white shadow-md shadow-blue-950/15"
                  : "border-blue-100 bg-white text-slate-600 hover:-translate-y-0.5 hover:text-[#0A1F44]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-blue-200 bg-white/70 p-10 text-center shadow-lg shadow-blue-950/5 backdrop-blur-md">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <FileText className="size-7" />
          </div>
          <h3 className="mt-4 font-heading text-2xl font-semibold text-[#0A1F44]">
            No notes submitted yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Upload your first note and SmartNotes will review it before it appears publicly.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          {filteredNotes.length === 0 && (
            <div className="rounded-3xl border border-dashed border-blue-200 bg-white/70 p-8 text-center text-sm text-slate-500">
              No notes match this status.
            </div>
          )}
          {filteredNotes.map((note) => {
            const status = note.status || "processing";
return (
  <div
    key={note._id}
    className="group rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-blue-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-blue-950/10"
  >
    <div className="flex flex-col gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <span className="text-sm text-slate-500">
            {formatDate(note._createdAt)}
          </span>
        </div>

        <Link href={`/notespage/${note._id}`}>
          <h3 className="mt-3 line-clamp-1 font-heading text-2xl font-semibold text-[#0A1F44] transition-colors hover:text-blue-700">
            {note.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {status === "rejected"
            ? note.reviewReason || "No review reason provided."
            : note.description}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <Link
          href={`/notespage/${note._id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <FileText className="size-4" />
          Open
        </Link>

        {(status === "approved" || status === "rejected") && (
          <Link
            href={`/notespage/${note._id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
          >
            <Pencil className="size-4" />
            Edit
          </Link>
        )}

        <DeleteNoteButton noteId={note._id} />
      </div>
    </div>
  </div>
);
          })}
        </div>
      )}
    </section>
  );
}
