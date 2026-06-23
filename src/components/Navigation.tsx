import Link from "next/link";
import Image from "next/image";
import { BadgePlus, LogIn, User, UserPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const Navigation = async () => {
  const user = await getCurrentUser();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {user ? (
            <>
              <Link href="/notespage/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>
              <Link href="/profile" className="flex items-center gap-2">
                <span className="max-sm:hidden">Profile</span>
                <User className="size-6 sm:hidden" />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-2">
                <span className="max-sm:hidden">Login</span>
                <LogIn className="size-6 sm:hidden" />
              </Link>
              <Link href="/register" className="flex items-center gap-2">
                <span className="max-sm:hidden">Register</span>
                <UserPlus className="size-6 sm:hidden" />
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
