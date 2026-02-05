
import { useRouter } from "next/router";
import Link from "next/link";
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
      body: JSON.stringify({ email, password }), // ✅ correct
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    router.push("/dashboard"); // ✅ success
  }

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* LEFT GREEN SHAPE */}
      <div className="absolute left-0 top-0 h-full w-1/2 bg-[#54a987] rounded-r-[400px] flex items-center justify-center">
        <h1 className="text-white text-6xl font-bold">Welcome</h1>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="ml-auto w-1/2 flex items-center justify-center">
        <form
          onSubmit={submit}
          className="w-[360px] bg-white rounded-2xl shadow-xl p-8 space-y-5"
        >
          {/* ✅ EMAIL (not username) */}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-[#54a987] hover:bg-[#4a9b7b] text-white py-3 rounded-md font-semibold"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm font-semibold cursor-pointer">
            Forgot password?
          </p>

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
