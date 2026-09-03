"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      if (data.role === "PROVIDER") {
        const profileRes = await fetch(
          `/api/provider-profile?userId=${data.id}`
        );

        const profileData =
          await profileRes.json();

        if (profileData.hasProfile) {
          router.push("/dashboard");
        } else {
          router.push("/provider-setup");
        }
      } else {
        router.push("/providers");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md">

        {/* LOGO / BRAND */}
        <div className="text-center mb-8">

          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              C
            </div>

            <span className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-violet-500 bg-clip-text text-transparent">
              CampusBook
            </span>
          </Link>

          <p className="text-gray-500 mt-3">
            Welcome back. Sign in to continue.
          </p>

        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-7 md:p-8">

          <div className="mb-7">

            <p className="text-purple-600 font-semibold uppercase tracking-wider text-sm">
              Account Access
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Login
            </h1>

            <p className="text-gray-500 mt-2">
              Enter your account details below.
            </p>

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-gray-200 bg-gray-50 px-12 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
                className="w-full border border-gray-200 bg-gray-50 px-12 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition"
              />

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-violet-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-sm text-gray-400">
              New to CampusBook?
            </span>

            <div className="flex-1 h-px bg-gray-200" />

          </div>

          {/* REGISTER */}
          <Link
            href="/register"
            className="block w-full text-center border border-purple-200 text-purple-700 py-3.5 rounded-xl font-semibold hover:bg-purple-50 transition"
          >
            Create an Account
          </Link>

        </div>

        {/* EXTRA TEXT */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Book campus services with less stress.
        </p>

      </div>

    </main>
  );
}