import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "../auth";
import { BadgePlus, LogOut } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
console.log("Auth function:", typeof auth); // Should log "function"

  const Navigation = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">

          {session && session?.user ? (
            <>
              <Link href="/notespage/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
              <span>{session?.user?.name}</span>
                {/* <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar> */}
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;

// 'use client';



// import { SignInButton , 
//   SignOutButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut
//   // UserButton
// } from '@clerk/nextjs';
// import Link from 'next/link';
// export const Navigation = () => {
//   return( 
//     <nav className="bg-[var(--background)] border-b border-[var(--foreground)]/10">
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//         <div className='flex justify-between h-16 items-center'>
//           <div className='flex-shrink-0'>
//             <h1 className='text-xl font-semibold text-[var(--foreground)] '>
//               Smart Notes App
//             </h1>
//           </div>
//           <div className='flex items-center gap-4'>
//             <SignedOut>
//             <SignInButton mode="modal">
//               <button className='px-2 py-1 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 '>Sign In</button>
//             </SignInButton>
//             <SignUpButton mode="modal">
// <button className='px-2 py-1 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 '>Sign Up</button>
//             </SignUpButton>
//             </SignedOut>
//             <SignedIn>
//               <Link href={"/user-profile"}>Profile</Link>
//             <SignOutButton></SignOutButton>
//             </SignedIn>
//           </div>
//         </div>
//       </div>

//     </nav>
//   )

// }

// export default function Navigation() {
//   const { user, logout, isAuthenticated } = useAuth();

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-xl font-bold text-gray-900">
//               SmartNotes
//             </Link>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <Link
//               href="/browse"
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Browse Notes
//             </Link>
            
//             {isAuthenticated ? (
//               <>
//                 <Link
//                   href="/upload"
//                   className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Upload Notes
//                 </Link>
//                 <Link
//                   href="/dashboard"
//                   className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Dashboard
//                 </Link>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">
//                     {user?.points} pts
//                   </span>
//                   <button
//                     onClick={logout}
//                     className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   <SignInButton mode="modal"/>
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// } 