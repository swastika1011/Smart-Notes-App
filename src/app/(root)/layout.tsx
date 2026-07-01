import type { Metadata } from "next";
// import "easymde/dist/easymde.min.css";
import { Toaster } from "sonner";

import Navigation from "@/components/Navigation";
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
    <>
      <body >
      <div >
      <Navigation />
      {children}
      <Toaster />
      </div>
      </body>
      
    </>
  );
}
