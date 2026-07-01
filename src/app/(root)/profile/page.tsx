import { redirect } from "next/navigation";
import DeleteAccountSection from "@/components/DeleteAccountSection";
import ProfileForm from "@/components/ProfileForm";
import ProfileNotesDashboard from "@/components/ProfileNotesDashboard";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getNotesByOwner } from "@/lib/notes-data";
import { User } from "@/models/user";

type ProfileUser = {
  name: string;
  email: string;
  image?: string;
  profileImage?: string;
  bio?: string;
  country?: string;
  university?: string;
  universityName?: string;
  github?: string;
  linkedin?: string;
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.userId) {
    redirect("/login");
  }

  await connectDB();

  const [user, notes] = await Promise.all([
    User.findById(currentUser.userId).select("-password").lean(),
    getNotesByOwner(currentUser.userId),
  ]);

  if (!user) {
    redirect("/login");
  }

  const profileUser = JSON.parse(JSON.stringify(user)) as ProfileUser;

  return (
    <section className="section_container">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Account settings</p>
        <h1 className="text-30-bold">Profile</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Update your public profile details and manage your uploaded notes.
        </p>
      </div>

      <ProfileForm user={profileUser} />
      <ProfileNotesDashboard notes={notes} />
      <DeleteAccountSection />
    </section>
  );
}
