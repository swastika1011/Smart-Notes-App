"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        text-sm
        font-medium
        text-slate-700
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-white/70
        hover:text-[#0A1F44]
        font-body
      "
    >
      <LogOut className="size-5" />

      <span className="">
        Logout
      </span>
    </button>
  );
}
