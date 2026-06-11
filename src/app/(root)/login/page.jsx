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
    } else {
      setMessage(data.message || "Login failed");
    }
  }

  return (
    <main className="section_container">
      <h1 className="text-30-bold">Login</h1>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4 max-w-md">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-3"
        />

        <button type="submit" className="bg-black text-white p-3">
          Login
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}