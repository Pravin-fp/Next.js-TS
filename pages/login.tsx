

import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // ✅ SUCCESS → GO TO DASHBOARD
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#3f4868] flex flex-col items-center">
      <h1 className="text-white text-3xl font-semibold mt-10">
        Login & Signup Forms
      </h1>

      <div className="flex gap-16 mt-10 text-white uppercase tracking-wide">
        <span className="border-b-2 border-white pb-1">Login</span>
        <Link href="/signup" className="opacity-60 hover:opacity-100">
          Sign Up
        </Link>
      </div>

      <div className="relative mt-12">
        <div className="absolute -right-6 top-6 w-80 h-[420px] bg-blue-100 rounded-lg"></div>

        {/* ✅ React-controlled form */}
        <form
          onSubmit={submit}
          className="relative bg-white w-80 p-8 rounded-lg shadow-xl space-y-6"
        >
          <div>
            <label className="text-sm text-gray-500">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-lime-400 hover:bg-lime-500 text-white py-2 rounded-full font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}