

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    username: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "user" }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* LEFT GREEN SHAPE */}
      <div className="absolute left-0 top-0 h-full w-1/2 bg-[#54a987] rounded-r-[400px] flex items-center justify-center">
        <h1 className="text-white text-6xl font-bold">Welcome</h1>
      </div>

      {/* RIGHT SIGNUP CARD */}
      <div className="ml-auto w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSignup}
          className="w-[380px] bg-white rounded-2xl shadow-xl p-8 space-y-4"
        >
          {["name", "username", "phone", "email", "password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={(form as any)[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none"
              required
            />
          ))}

          <button
            disabled={loading}
            className="w-full bg-[#54a987] hover:bg-[#4a9b7b] text-white py-3 rounded-md font-semibold"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
