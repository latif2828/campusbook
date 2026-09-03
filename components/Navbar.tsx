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
        console.error("Could not read user:", error);

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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-purple-600"
        >
          CampusBook
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-5">

          {/* LOADING */}
          {!loaded && (
            <span className="text-gray-400">
              Loading...
            </span>
          )}

          {/* NOT LOGGED IN */}
          {loaded && !user && (
            <>
              <Link
                href="/providers"
                className="hover:text-purple-600"
              >
                Providers
              </Link>

              <Link
                href="/login"
                className="hover:text-purple-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Register
              </Link>
            </>
          )}

          {/* STUDENT */}
          {loaded && user?.role === "STUDENT" && (
            <>
              <Link
                href="/providers"
                className="hover:text-purple-600"
              >
                Providers
              </Link>

              <Link
                href="/my-bookings"
                className="hover:text-purple-600"
              >
                My Bookings
              </Link>

              <span className="text-gray-500">
                {user.name}
              </span>

              <button
                type="button"
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* PROVIDER */}
          {loaded && user?.role === "PROVIDER" && (
            <>
              <Link
                href="/dashboard"
                className="hover:text-purple-600"
              >
                Dashboard
              </Link>

              <Link
                href="/provider-services"
                className="hover:text-purple-600"
              >
                Services
              </Link>

              <Link
                href="/provider-availability"
                className="hover:text-purple-600"
              >
                Availability
              </Link>

              <span className="text-gray-500">
                {user.name}
              </span>

              <button
                type="button"
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}