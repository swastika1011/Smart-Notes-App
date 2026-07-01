"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogIn, Menu, UploadCloud, User, UserPlus, X } from "lucide-react";

import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

const linkBase =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#0A1F44]";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        linkBase,
        active && "bg-white text-[#0A1F44] shadow-sm ring-1 ring-blue-100",
      )}
    >
      {children}
    </Link>
  );
}

export default function NavigationClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  const authedLinks = (
    <>
      <NavLink href="/notespage/create">
        <UploadCloud className="size-4" />
        <span>Upload Notes</span>
      </NavLink>
      <NavLink href="/profile">
        <User className="size-4" />
        <span>Profile</span>
      </NavLink>
      <LogoutButton />
    </>
  );

  const guestLinks = (
    <>
      <NavLink href="/login">
        <LogIn className="size-4" />
        <span>Login</span>
      </NavLink>
      <NavLink href="/register">
        <UserPlus className="size-4" />
        <span>Register</span>
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 shadow-sm shadow-blue-950/5 backdrop-blur-xl ">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl px-1 py-2 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-[#0A1F44] text-white shadow-md shadow-blue-950/15">
            <BookOpen className="size-5" />
          </span>
          <span className=" hidden sm:block font-heading text-2xl font-semibold text-[#0A1F44]">
            SmartNotes
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? authedLinks : guestLinks}
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-blue-100 text-[#0A1F44] shadow-sm transition-all duration-200 hover:bg-blue-100 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden border-t border-white/60 px-4 backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr] py-3 opacity-100" : "grid-rows-[0fr] py-0 opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-2">
            {isLoggedIn ? authedLinks : guestLinks}
          </div>
        </div>
      </div>
    </header>
  );
}
