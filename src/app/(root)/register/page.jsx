"use client";

import { useState } from "react";

export default function RegisterPage() {
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
      setMessage("Registered successfully");
    } else {
      setMessage(data.message || "Something went wrong");
    }
  }

  return (
    <main className="section_container">
      <h1 className="text-30-bold">Register</h1>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4 max-w-md">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-3"
        />

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
          Register
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}