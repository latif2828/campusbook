"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BookingItem = {
  id: string;
  date: string;
  status: string;

  student: {
    name: string;
  };

  service: {
    name: string;
    price: number;
    duration: number;
  };

  provider: {
    business: string;
  };
};

type ProviderInfo = {
  id: string;
  business: string;
  category: string;
  location: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [provider, setProvider] = useState<ProviderInfo | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD PROVIDER BOOKINGS
  // ==========================================

  useEffect(() => {
    const loadBookings = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.push("/login");
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error("USER ERROR:", error);

        localStorage.removeItem("user");
        router.push("/login");

        return;
      }

      // Only providers can open dashboard
      if (user.role !== "PROVIDER") {
        router.push("/providers");
        return;
      }

      try {
        const res = await fetch(
          `/api/bookings?userId=${user.id}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(
            data.error || "Could not load dashboard."
          );

          setLoading(false);
          return;
        }

        setBookings(data.bookings || []);
        setProvider(data.provider);
      } catch (error) {
        console.error(
          "LOAD BOOKINGS ERROR:",
          error
        );

        alert("Could not load dashboard.");
      }

      setLoading(false);
    };

    loadBookings();
  }, [router]);

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  const updateBookingStatus = async (
    bookingId: string,
    status: string
  ) => {
    try {
      const res = await fetch(
        `/api/bookings/${bookingId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Could not update booking."
        );

        return;
      }

      // Update status immediately on the page
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: data.status,
              }
            : booking
        )
      );

      if (status === "CONFIRMED") {
        alert("Booking confirmed.");
      }

      if (status === "COMPLETED") {
        alert("Booking completed.");
      }

      if (status === "CANCELLED") {
        alert("Booking cancelled.");
      }
    } catch (error) {
      console.error(
        "UPDATE BOOKING ERROR:",
        error
      );

      alert("Something went wrong.");
    }
  };

  // ==========================================
  // STATUS STYLING
  // ==========================================

  const getStatusStyle = (status: string) => {
    if (status === "PENDING") {
      return "bg-yellow-100 text-yellow-700";
    }

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

  // ==========================================
  // COUNTERS
  // ==========================================

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED"
  ).length;

  const completedCount = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED"
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-purple-50 p-8">
          <div className="max-w-6xl mx-auto">
            <p>Loading dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-purple-50">
        <div className="max-w-6xl mx-auto p-8">

          {/* HEADER */}

          <div className="mb-8">
            <h1 className="text-4xl font-bold">
              Provider Dashboard
            </h1>

            {provider && (
              <>
                <p className="text-xl font-semibold mt-2">
                  {provider.business}
                </p>

                <p className="text-gray-500">
                  {provider.category} •{" "}
                  {provider.location}
                </p>
              </>
            )}
          </div>

          {/* SUMMARY CARDS */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

            {/* TOTAL */}

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                Total Bookings
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {bookings.length}
              </h2>
            </div>

            {/* PENDING */}

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-2 text-yellow-600">
                {pendingCount}
              </h2>
            </div>

            {/* CONFIRMED */}

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                Confirmed
              </p>

              <h2 className="text-3xl font-bold mt-2 text-purple-600">
                {confirmedCount}
              </h2>
            </div>

            {/* COMPLETED */}

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-600">
                {completedCount}
              </h2>
            </div>

          </div>

          {/* APPOINTMENTS HEADER */}

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">
              Appointments
            </h2>

            <span className="text-gray-500">
              {bookings.length} booking
              {bookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* BOOKINGS */}

          <div className="space-y-5">

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-xl shadow"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-5">

                  {/* LEFT */}

                  <div>

                    <h3 className="font-bold text-xl">
                      {booking.service.name}
                    </h3>

                    <p className="mt-2">
                      Client:{" "}
                      <span className="font-semibold">
                        {booking.student.name}
                      </span>
                    </p>

                    <p className="text-gray-500 mt-1">
                      Duration:{" "}
                      {booking.service.duration} minutes
                    </p>

                    <p className="text-gray-500">
                      Price: GH₵
                      {booking.service.price}
                    </p>

                  </div>

                  {/* RIGHT */}

                  <div className="md:text-right">

                    <p className="font-semibold">
                      {new Date(
                        booking.date
                      ).toLocaleDateString()}
                    </p>

                    <p className="text-gray-500">
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

                {/* =================================
                    PENDING BUTTONS
                ================================= */}

                {booking.status === "PENDING" && (
                  <div className="flex flex-wrap gap-3 mt-5 border-t pt-5">

                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "CONFIRMED"
                        )
                      }
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Confirm Booking
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "CANCELLED"
                        )
                      }
                      className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>

                  </div>
                )}

                {/* =================================
                    CONFIRMED BUTTONS
                ================================= */}

                {booking.status === "CONFIRMED" && (
                  <div className="flex flex-wrap gap-3 mt-5 border-t pt-5">

                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "COMPLETED"
                        )
                      }
                      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                    >
                      Mark Completed
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "CANCELLED"
                        )
                      }
                      className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>

                  </div>
                )}

                {/* COMPLETED */}

                {booking.status === "COMPLETED" && (
                  <div className="mt-5 border-t pt-5">
                    <p className="text-green-600 font-semibold">
                      ✓ Appointment completed
                    </p>
                  </div>
                )}

                {/* CANCELLED */}

                {booking.status === "CANCELLED" && (
                  <div className="mt-5 border-t pt-5">
                    <p className="text-red-600 font-semibold">
                      This appointment was cancelled.
                    </p>
                  </div>
                )}

              </div>
            ))}

            {/* NO BOOKINGS */}

            {bookings.length === 0 && (
              <div className="bg-white p-10 rounded-xl shadow text-center">

                <h3 className="text-xl font-semibold mb-2">
                  No appointments yet
                </h3>

                <p className="text-gray-500">
                  New student bookings will appear here.
                </p>

              </div>
            )}

          </div>

        </div>
      </main>
    </>
  );
}