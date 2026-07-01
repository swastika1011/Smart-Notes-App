"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

if (res.ok) {
  setMessage("Successfull! Redirecting to login...");

  setTimeout(() => {
    router.push("/login");
  }, 1500);
} else {
  setMessage(data.message || "Something went wrong");
}
  }

return (
  <main className="min-h-screen">
<div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 pt-12 pb-10">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center pr-16">
        <div className="inline-flex w-fit items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 font-body">
          ✨ Join the SmartNotes community
        </div>

        <h1 className="mt-8 font-heading text-5xl leading-tight text-[#0A1F44]">
          Create
          <br />
          Your Account.
        </h1>

        <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-slate-600">
          Start sharing knowledge, discover quality study materials, and
          contribute to a trusted AI-reviewed learning community.
        </p>

        <div className="mt-10 space-y-4 font-body text-slate-700">
          <div>✓ Upload & Share Notes</div>
          <div>✓ AI Verified Content</div>
          <div>✓ Build Your Learning Profile</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 justify-center mt-2 mb-5">
        <div className=" relative w-full max-w-[480px] rounded-3xl border border-white/60 bg-white/70 p-6 lg:p-8 shadow-xl backdrop-blur-md">

          <h2 className="font-heading text-4xl text-[#0A1F44]">
            Register
          </h2>

          <p className="mt-4 font-body text-slate-600">
            Create your SmartNotes account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-4">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 font-body outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 font-body outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 font-body outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 font-body outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="mt-2 h-14 rounded-xl bg-[#0A1F44] font-body font-medium text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:bg-[#17336b]"
            >
              Create Account
            </button>
          </form>

{message && (
  <div
    className={`absolute top-7 right-5 rounded-xl px-4 py-2 text-sm shadow-lg ${
      message.toLowerCase().includes("success")
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-red-50 text-red-600 border border-red-200"
    }`}
  >
    {message}
  </div>
)}

          <p className="mt-8 text-center font-body text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#0A1F44] hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>

    </div>
  </main>
);
}