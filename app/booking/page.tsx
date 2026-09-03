"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type ServiceItem = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type ProviderItem = {
  id: string;
  business: string;
  category: string;
  location: string;
  services: ServiceItem[];
};

// ==========================================
// BOOKING CONTENT
// ==========================================

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const providerId = searchParams.get("provider");

  const [provider, setProvider] =
    useState<ProviderItem | null>(null);

  const [serviceId, setServiceId] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [availableSlots, setAvailableSlots] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [slotMessage, setSlotMessage] =
    useState("");

  // ==========================================
  // LOAD PROVIDER
  // ==========================================

  useEffect(() => {
    const loadProvider = async () => {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        router.push("/login");
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error(
          "USER ERROR:",
          error
        );

        localStorage.removeItem("user");
        router.push("/login");

        return;
      }

      if (user.role !== "STUDENT") {
        router.push("/dashboard");
        return;
      }

      if (!providerId) {
        alert("Provider not selected.");

        router.push("/providers");

        return;
      }

      try {
        const res = await fetch(
          `/api/providers/${providerId}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(
            data.error ||
              "Provider could not be loaded."
          );

          setLoading(false);

          return;
        }

        setProvider(data);
      } catch (error) {
        console.error(
          "LOAD PROVIDER ERROR:",
          error
        );

        alert("Something went wrong.");
      }

      setLoading(false);
    };

    loadProvider();
  }, [providerId, router]);

  // ==========================================
  // LOAD AVAILABLE SLOTS
  // ==========================================

  useEffect(() => {
    const loadAvailableSlots =
      async () => {
        setTime("");
        setAvailableSlots([]);
        setSlotMessage("");

        if (
          !providerId ||
          !serviceId ||
          !date
        ) {
          return;
        }

        setLoadingSlots(true);

        try {
          const res = await fetch(
            `/api/available-slots?providerId=${providerId}&serviceId=${serviceId}&date=${date}`
          );

          const data = await res.json();

          if (!res.ok) {
            setSlotMessage(
              data.error ||
                "Could not load available times."
            );

            setLoadingSlots(false);

            return;
          }

          setAvailableSlots(
            data.slots || []
          );

          if (data.message) {
            setSlotMessage(
              data.message
            );
          } else if (
            !data.slots ||
            data.slots.length === 0
          ) {
            setSlotMessage(
              "No available times for this date."
            );
          }
        } catch (error) {
          console.error(
            "LOAD SLOTS ERROR:",
            error
          );

          setSlotMessage(
            "Could not load available times."
          );
        }

        setLoadingSlots(false);
      };

    loadAvailableSlots();
  }, [
    providerId,
    serviceId,
    date,
  ]);

  // ==========================================
  // CREATE BOOKING
  // ==========================================

  const bookAppointment =
    async () => {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        router.push("/login");
        return;
      }

      const user =
        JSON.parse(storedUser);

      if (
        !providerId ||
        !serviceId ||
        !date ||
        !time
      ) {
        alert(
          "Please select a service, date and time."
        );

        return;
      }

      try {
        const res = await fetch(
          "/api/bookings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              studentId: user.id,
              providerId,
              serviceId,
              date,
              time,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          alert(
            data.error ||
              "Booking failed."
          );

          return;
        }

        alert(
          "Appointment booked successfully!"
        );

        router.push(
          "/my-bookings"
        );
      } catch (error) {
        console.error(
          "BOOKING ERROR:",
          error
        );

        alert(
          "Something went wrong."
        );
      }
    };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (
    value: string
  ) => {
    const [
      hourString,
      minute,
    ] = value.split(":");

    const hour =
      Number(hourString);

    const period =
      hour >= 12
        ? "PM"
        : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${minute} ${period}`;
  };

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-purple-50">
        <p>
          Loading provider...
        </p>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-purple-50">
        <p>
          Provider not found.
        </p>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-purple-50 flex items-center justify-center p-6">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2">
          Book Appointment
        </h1>

        <p className="text-lg font-semibold">
          {provider.business}
        </p>

        <p className="text-gray-500 mb-6">
          {provider.category} •{" "}
          {provider.location}
        </p>

        {/* SERVICE */}

        <label className="block font-semibold mb-2">
          Service
        </label>

        <select
          value={serviceId}
          onChange={(e) =>
            setServiceId(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">
            Select Service
          </option>

          {provider.services.map(
            (service) => (
              <option
                key={service.id}
                value={service.id}
              >
                {service.name}
                {" - "}GH₵
                {service.price}
                {" - "}
                {service.duration}
                {" mins"}
              </option>
            )
          )}
        </select>

        {/* DATE */}

        <label className="block font-semibold mb-2">
          Date
        </label>

        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        {/* TIME */}

        <label className="block font-semibold mb-2">
          Available Time
        </label>

        <select
          value={time}
          onChange={(e) =>
            setTime(
              e.target.value
            )
          }
          disabled={
            !serviceId ||
            !date ||
            loadingSlots ||
            availableSlots.length === 0
          }
          className="w-full border p-3 rounded-lg mb-2 disabled:bg-gray-100"
        >
          <option value="">
            {loadingSlots
              ? "Loading available times..."
              : "Select Time"}
          </option>

          {availableSlots.map(
            (slot) => (
              <option
                key={slot}
                value={slot}
              >
                {formatTime(
                  slot
                )}
              </option>
            )
          )}
        </select>

        {slotMessage && (
          <p className="text-sm text-red-500 mb-4">
            {slotMessage}
          </p>
        )}

        {!slotMessage && (
          <div className="mb-4" />
        )}

        {/* CONFIRM */}

        <button
          type="button"
          onClick={
            bookAppointment
          }
          disabled={
            !serviceId ||
            !date ||
            !time
          }
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>

      </div>
    </main>
  );
}

// ==========================================
// MAIN PAGE
// Suspense fixes Vercel/Next.js prerendering
// ==========================================

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-purple-50">
          <p>
            Loading booking page...
          </p>
        </main>
      }
    >
      <BookingContent />
    </Suspense>
  );
}