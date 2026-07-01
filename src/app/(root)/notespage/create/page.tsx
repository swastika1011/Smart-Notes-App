import React from "react";
import { redirect } from "next/navigation";
import SubmissionForm from "@/components/SubmissionForm";
import { getCurrentUser } from "@/lib/auth";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <section className="pink_container !min-h-[230px] !py-2 ">
        <h1 className="heading">Submit Your Notes</h1>
      </section>
      <SubmissionForm />
    </>
  );
};

export default Page;
