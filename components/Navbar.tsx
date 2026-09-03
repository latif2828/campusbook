"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "PROVIDER";
};

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error(
          "Could not read user:",
          error
        );

        localStorage.removeItem("user");
      }
    }

    setLoaded(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");

    setUser(null);

    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        <div className="h-20 flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition">
              C
            </div>

            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-violet-500 bg-clip-text text-transparent">
              CampusBook
            </span>

          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* LOADING */}
            {!loaded && (
              <div className="flex items-center gap-2 text-gray-400">

                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />

                <span className="hidden md:inline">
                  Loading...
                </span>

              </div>
            )}

            {/* ==========================================
                NOT LOGGED IN
            ========================================== */}

            {loaded && !user && (
              <>

                <Link
                  href="/providers"
                  className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                >
                  Providers
                </Link>

                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                >
                  Register
                </Link>

              </>
            )}

            {/* ==========================================
                STUDENT
            ========================================== */}

            {loaded &&
              user?.role === "STUDENT" && (
                <>

                  <Link
                    href="/providers"
                    className="hidden sm:block px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  >
                    Providers
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="hidden sm:block px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  >
                    My Bookings
                  </Link>

                  {/* USER */}
                  <div className="hidden md:flex items-center gap-3 bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl">

                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                      {user.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="leading-tight">

                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-purple-600">
                        Student
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-100 transition"
                  >
                    Logout
                  </button>

                </>
              )}

            {/* ==========================================
                PROVIDER
            ========================================== */}

            {loaded &&
              user?.role === "PROVIDER" && (
                <>

                  <Link
                    href="/dashboard"
                    className="hidden md:block px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/provider-services"
                    className="hidden md:block px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  >
                    Services
                  </Link>

                  <Link
                    href="/provider-availability"
                    className="hidden md:block px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
                  >
                    Availability
                  </Link>

                  {/* PROVIDER USER */}
                  <div className="hidden lg:flex items-center gap-3 bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl">

                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-semibold">
                      {user.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="leading-tight">

                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-purple-600">
                        Provider
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-100 transition"
                  >
                    Logout
                  </button>

                </>
              )}

          </div>

        </div>

      </div>

    </nav>
  );
}