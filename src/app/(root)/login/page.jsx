"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
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

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/user/${data.userId}`);
      router.refresh();
    } else {
      setMessage(data.message || "Login failed");
    }
  }

  return (
  <main className="min-h-screen">
<div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6">      {/* Left Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center pr-16">
        <div className="inline-flex w-fit items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 font-body">
          ✨ AI-powered study platform
        </div>

        <h1 className="mt-8 font-heading text-5xl leading-tight text-[#0A1F44]">
          Welcome
          <br />
          Back.
        </h1>

        <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-slate-600">
          Continue sharing knowledge, discover high-quality study materials,
          and let AI help keep the community trustworthy.
        </p>

        <div className="mt-10 space-y-4 font-body text-slate-700">
          <div>✓ AI Reviewed Notes</div>
          <div>✓ Secure Authentication</div>
          <div>✓ Student Community</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-md">

          <h2 className="font-heading text-4xl text-[#0A1F44]">
            Login
          </h2>

          <p className="mt-3 font-body text-slate-600">
            Sign in to continue to SmartNotes.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="
                h-14
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                font-body
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="
                h-14
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                font-body
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

            <button
              type="submit"
              className="
                mt-2
                h-14
                rounded-xl
                bg-[#0A1F44]
                font-body
                font-medium
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#17336b]
              "
            >
              Login
            </button>
          </form>

          {message && (
            <p className="mt-5 text-sm text-red-500 font-body">
              {message}
            </p>
          )}

          <p className="mt-8 text-center font-body text-slate-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-[#0A1F44] hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>

    </div>
  </main>
  );
}
