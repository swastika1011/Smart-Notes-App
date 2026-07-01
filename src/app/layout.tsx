import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, Sora } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});


// import { Navigation } from "@/components/Navigation";
export const metadata: Metadata = {
  title: "SmartNotes - Share Academic Notes & Earn Points",
  description: "Upload and share academic notes with AI-powered validation. Earn points when others view and download your notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  className={`${fraunces.variable} ${sora.variable}`}
>
  <body className="font-body">
<div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">

  {/* Background */}

  {/* Left Blue Glow */}
  <div
    className="
      absolute
      left-[-90px]
      top-[240px]
      h-[220px]
      w-[220px]
      rounded-full
      bg-sky-500/55
      blur-[40px]
    "
  />

  {/* Top Purple Glow */}
  <div
    className="
      absolute
      right-[24%]
      top-[40px]
      h-[180px]
      w-[180px]
      rounded-full
      bg-violet-500/45
      blur-[40px]
    "
  />

  {/* Right Purple Glow */}
  <div
    className="
      absolute
      right-[-70px]
      top-[330px]
      h-[240px]
      w-[240px]
      rounded-full
      bg-indigo-500/40
      blur-[40px]
    "
  />

  {/* Bottom Center Glow */}
  <div
    className="
      absolute
      left-1/2
      bottom-[-100px]
      -translate-x-1/2
      h-[260px]
      w-[260px]
      rounded-full
      bg-sky-300/25
      blur-[80px]
    "
  />
  {/* Bottom Left */}
<div
  className="
    fixed
    -left-40
    -bottom-36
    -z-50
    h-[420px]
    w-[420px]
    rounded-full
    bg-sky-300/15
    blur-[140px]
    pointer-events-none
  "
/>

{/* Bottom Right */}
<div
  className="
    fixed
    -right-40
    -bottom-36
    -z-50
    h-[420px]
    w-[420px]
    rounded-full
    bg-violet-300/15
    blur-[140px]
    pointer-events-none
  "
/>

</div>
          
          
          {children}
         
       
      </body>
    </html>
 
  );
}
