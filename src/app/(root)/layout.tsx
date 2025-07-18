import type { Metadata } from "next";
import "../globals.css"
// import "easymde/dist/easymde.min.css";
import { Toaster, toast } from "sonner"



import Navigation  from "@/components/Navigation";
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
     
    <html lang="en">
      <body className="antialiased">
          
          <Navigation></Navigation>
          {children}
          <Toaster/>
         
       
      </body>
    </html>
    
  );
}
