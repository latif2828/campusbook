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
  const [provider, setProvider] =
    useState<ProviderInfo | null>(null);

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
            data.error ||
              "Could not load dashboard."
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
            "Content-Type":
              "application/json",
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
  // STATUS STYLES
  // ==========================================

  const getStatusStyle = (
    status: string
  ) => {
    if (status === "PENDING") {
      return "bg-amber-100 text-amber-700 border-amber-200";
    }

    if (status === "CONFIRMED") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }

    if (status === "COMPLETED") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // ==========================================
  // COUNTERS
  // ==========================================

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === "PENDING"
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

        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">

          <div className="bg-white px-8 py-6 rounded-2xl shadow-lg border border-purple-100">

            <div className="flex items-center gap-3">

              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />

              <p className="font-medium text-gray-700">
                Loading dashboard...
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

        <div className="max-w-7xl mx-auto px-5 py-10 md:py-14">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="mb-10">

            <p className="text-purple-600 font-semibold uppercase tracking-wider text-sm mb-2">
              Business Overview
            </p>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

              <div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Provider Dashboard
                </h1>

                {provider && (
                  <div className="mt-4">

                    <h2 className="text-xl font-semibold text-gray-800">
                      {provider.business}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-3">

                      <span className="bg-white border border-purple-100 shadow-sm px-4 py-2 rounded-full text-sm text-purple-700 font-medium">
                        ✨ {provider.category}
                      </span>

                      <span className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600 font-medium">
                        📍 {provider.location}
                      </span>

                    </div>

                  </div>
                )}

              </div>

              <div className="bg-white border border-purple-100 shadow-sm rounded-2xl px-5 py-4">

                <p className="text-sm text-gray-500">
                  Total Appointments
                </p>

                <p className="text-3xl font-bold text-purple-700 mt-1">
                  {bookings.length}
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              SUMMARY CARDS
          ========================================== */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">

            {/* TOTAL */}

            <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm font-medium">
                    Total Bookings
                  </p>

                  <p className="text-4xl font-bold text-gray-900 mt-3">
                    {bookings.length}
                  </p>

                </div>

                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                  📅
                </div>

              </div>

            </div>

            {/* PENDING */}

            <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm font-medium">
                    Pending
                  </p>

                  <p className="text-4xl font-bold text-amber-600 mt-3">
                    {pendingCount}
                  </p>

                </div>

                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                  ⏳
                </div>

              </div>

            </div>

            {/* CONFIRMED */}

            <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm font-medium">
                    Confirmed
                  </p>

                  <p className="text-4xl font-bold text-purple-600 mt-3">
                    {confirmedCount}
                  </p>

                </div>

                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                  ✓
                </div>

              </div>

            </div>

            {/* COMPLETED */}

            <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm font-medium">
                    Completed
                  </p>

                  <p className="text-4xl font-bold text-green-600 mt-3">
                    {completedCount}
                  </p>

                </div>

                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
                  ✅
                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              APPOINTMENTS HEADER
          ========================================== */}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">

            <div>

              <p className="text-purple-600 font-semibold uppercase tracking-wider text-sm">
                Schedule
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Appointments
              </h2>

              <p className="text-gray-500 mt-1">
                Manage your student bookings and appointment status.
              </p>

            </div>

            <span className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600">
              {bookings.length} booking
              {bookings.length !== 1
                ? "s"
                : ""}
            </span>

          </div>

          {/* ==========================================
              BOOKINGS
          ========================================== */}

          <div className="space-y-5">

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition overflow-hidden"
              >

                <div className="p-6 md:p-7">

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                    {/* LEFT */}

                    <div className="flex gap-4">

                      <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-purple-100 items-center justify-center text-2xl shrink-0">
                        ✨
                      </div>

                      <div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          {booking.service.name}
                        </h3>

                        <p className="mt-2 text-gray-700">
                          Client:{" "}
                          <span className="font-semibold">
                            {booking.student.name}
                          </span>
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">

                          <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm">
                            ⏱{" "}
                            {
                              booking.service
                                .duration
                            }{" "}
                            minutes
                          </span>

                          <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                            GH₵
                            {
                              booking.service
                                .price
                            }
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="lg:text-right">

                      <p className="font-semibold text-gray-900 text-lg">
                        {new Date(
                          booking.date
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-gray-500 mt-1">
                        {new Date(
                          booking.date
                        ).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </p>

                      <span
                        className={`inline-block mt-3 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ==========================================
                    PENDING ACTIONS
                ========================================== */}

                {booking.status ===
                  "PENDING" && (
                  <div className="bg-amber-50/60 border-t border-amber-100 px-6 md:px-7 py-5">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <p className="text-sm text-amber-700 font-medium">
                        This appointment is waiting for your response.
                      </p>

                      <div className="flex flex-wrap gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "CONFIRMED"
                            )
                          }
                          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition shadow-sm"
                        >
                          ✓ Confirm Booking
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "CANCELLED"
                            )
                          }
                          className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  </div>
                )}

                {/* ==========================================
                    CONFIRMED ACTIONS
                ========================================== */}

                {booking.status ===
                  "CONFIRMED" && (
                  <div className="bg-purple-50/60 border-t border-purple-100 px-6 md:px-7 py-5">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <p className="text-sm text-purple-700 font-medium">
                        This appointment has been confirmed.
                      </p>

                      <div className="flex flex-wrap gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "COMPLETED"
                            )
                          }
                          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm"
                        >
                          ✓ Mark Completed
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "CANCELLED"
                            )
                          }
                          className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  </div>
                )}

                {/* ==========================================
                    COMPLETED
                ========================================== */}

                {booking.status ===
                  "COMPLETED" && (
                  <div className="bg-green-50 border-t border-green-100 px-6 md:px-7 py-4">

                    <p className="text-green-700 font-semibold">
                      ✓ Appointment completed successfully
                    </p>

                  </div>
                )}

                {/* ==========================================
                    CANCELLED
                ========================================== */}

                {booking.status ===
                  "CANCELLED" && (
                  <div className="bg-red-50 border-t border-red-100 px-6 md:px-7 py-4">

                    <p className="text-red-600 font-semibold">
                      This appointment was cancelled.
                    </p>

                  </div>
                )}

              </div>
            ))}

            {/* ==========================================
                NO BOOKINGS
            ========================================== */}

            {bookings.length === 0 && (
              <div className="bg-white border-2 border-dashed border-purple-200 rounded-3xl p-12 text-center shadow-sm">

                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                  📅
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  No appointments yet
                </h3>

                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  When students book one of your services, their appointments will appear here.
                </p>

              </div>
            )}

          </div>

        </div>
      </main>
    </>
  );
}