"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DayAvailability = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

const defaultDays: DayAvailability[] = [
  {
    day: "Monday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    day: "Tuesday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    day: "Wednesday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    day: "Thursday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    day: "Friday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    day: "Saturday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    day: "Sunday",
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
];

export default function ProviderAvailabilityPage() {
  const router = useRouter();

  const [days, setDays] =
    useState<DayAvailability[]>(defaultDays);

  const [userId, setUserId] = useState("");
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAvailability = async () => {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "PROVIDER") {
        router.push("/providers");
        return;
      }

      setUserId(user.id);

      try {
        const res = await fetch(
          `/api/availability?userId=${user.id}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(
            data.error ||
              "Could not load availability."
          );

          setLoading(false);
          return;
        }

        setBusiness(data.provider.business);

        setDays(
          defaultDays.map((day) => {
            const saved =
              data.availabilities.find(
                (item: {
                  day: string;
                  startTime: string;
                  endTime: string;
                }) => item.day === day.day
              );

            if (saved) {
              return {
                ...day,
                enabled: true,
                startTime: saved.startTime,
                endTime: saved.endTime,
              };
            }

            return day;
          })
        );
      } catch (error) {
        console.error(
          "LOAD AVAILABILITY ERROR:",
          error
        );

        alert("Something went wrong.");
      }

      setLoading(false);
    };

    loadAvailability();
  }, [router]);

  const toggleDay = (
    index: number
  ) => {
    setDays((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item
      )
    );
  };

  const updateStartTime = (
    index: number,
    value: string
  ) => {
    setDays((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              startTime: value,
            }
          : item
      )
    );
  };

  const updateEndTime = (
    index: number,
    value: string
  ) => {
    setDays((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              endTime: value,
            }
          : item
      )
    );
  };

  const saveAvailability = async () => {
    const activeDays = days
      .filter((day) => day.enabled)
      .map((day) => ({
        day: day.day,
        startTime: day.startTime,
        endTime: day.endTime,
      }));

    for (const day of activeDays) {
      if (day.startTime >= day.endTime) {
        alert(
          `${day.day}: opening time must be before closing time.`
        );

        return;
      }
    }

    setSaving(true);

    try {
      const res = await fetch(
        "/api/availability",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            userId,
            availabilities: activeDays,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Could not save availability."
        );

        setSaving(false);
        return;
      }

      alert(
        "Availability saved successfully!"
      );
    } catch (error) {
      console.error(
        "SAVE AVAILABILITY ERROR:",
        error
      );

      alert("Something went wrong.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="p-8">
          Loading availability...
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-purple-50">
        <div className="max-w-4xl mx-auto p-8">

          <h1 className="text-4xl font-bold">
            Availability
          </h1>

          <p className="text-gray-500 mt-2">
            {business}
          </p>

          <p className="text-gray-500 mb-8">
            Choose the days and times
            students can book you.
          </p>

          <div className="space-y-4">

            {days.map((day, index) => (
              <div
                key={day.day}
                className="bg-white shadow rounded-xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={() =>
                        toggleDay(index)
                      }
                      className="w-5 h-5"
                    />

                    <h2 className="text-lg font-bold">
                      {day.day}
                    </h2>

                  </div>

                  {day.enabled ? (
                    <div className="flex items-center gap-3">

                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Start
                        </label>

                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) =>
                            updateStartTime(
                              index,
                              e.target.value
                            )
                          }
                          className="border p-2 rounded-lg"
                        />
                      </div>

                      <span className="mt-5">
                        to
                      </span>

                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          End
                        </label>

                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) =>
                            updateEndTime(
                              index,
                              e.target.value
                            )
                          }
                          className="border p-2 rounded-lg"
                        />
                      </div>

                    </div>
                  ) : (
                    <p className="text-red-500 font-semibold">
                      Closed
                    </p>
                  )}

                </div>
              </div>
            ))}

          </div>

          <button
            type="button"
            onClick={saveAvailability}
            disabled={saving}
            className="mt-8 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Availability"}
          </button>

        </div>
      </main>
    </>
  );
}