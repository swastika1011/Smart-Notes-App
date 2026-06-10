import Link from "next/link";
import Image from "next/image";
import { BadgePlus, LogIn } from "lucide-react";

const Navigation = () => {
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          <Link href="/notespage/create">
            <span className="max-sm:hidden">Create</span>
            <BadgePlus className="size-6 sm:hidden" />
          </Link>
          <Link href="/login" className="flex items-center gap-2">
            <span className="max-sm:hidden">Login</span>
            <LogIn className="size-6 sm:hidden" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
