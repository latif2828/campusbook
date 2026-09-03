"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BookingItem = {
  id: string;
  date: string;
  status: string;

  provider: {
    business: string;
    category: string;
    location: string;
  };

  service: {
    name: string;
    price: number;
    duration: number;
  };
};

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "STUDENT") {
        router.push("/dashboard");
        return;
      }

      try {
        const res = await fetch(
          `/api/my-bookings?studentId=${user.id}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Could not load bookings.");
          setLoading(false);
          return;
        }

        setBookings(data);
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      }

      setLoading(false);
    };

    loadBookings();
  }, [router]);

  const getStatusStyle = (status: string) => {
    if (status === "CONFIRMED") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "COMPLETED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="p-8">
          <p>Loading bookings...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">
          My Bookings
        </h1>

        <p className="text-gray-500 mb-8">
          View all your appointments.
        </p>

        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {booking.service.name}
                  </h2>

                  <p className="font-semibold mt-1">
                    {booking.provider.business}
                  </p>

                  <p className="text-gray-500">
                    {booking.provider.category}
                  </p>

                  <p className="text-gray-500 mt-1">
                    📍 {booking.provider.location}
                  </p>

                  <p className="mt-3">
                    GH₵{booking.service.price}
                  </p>

                  <p className="text-gray-500">
                    {booking.service.duration} minutes
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="font-semibold">
                    {new Date(
                      booking.date
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    {new Date(
                      booking.date
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold mb-2">
                No bookings yet
              </h2>

              <p className="text-gray-500 mb-5">
                Find a service provider and make your first
                appointment.
              </p>

              <button
                onClick={() => router.push("/providers")}
                className="bg-purple-600 text-white px-5 py-3 rounded-lg"
              >
                Find Providers
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}