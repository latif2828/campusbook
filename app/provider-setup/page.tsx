"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProviderSetupPage() {
  const router = useRouter();

  const [business, setBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
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
  }, [router]);

  const createProfile = async () => {
    if (
      !business ||
      !category ||
      !location
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const res = await fetch(
        "/api/provider-profile",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            userId,
            business,
            category,
            location,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Could not create profile."
        );
        return;
      }

      alert(
        "Business profile created successfully!"
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-purple-50 flex justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg h-fit mt-10">

          <h1 className="text-3xl font-bold mb-2">
            Setup Your Business
          </h1>

          <p className="text-gray-500 mb-6">
            Add information about your
            service business.
          </p>

          <label className="block font-semibold mb-2">
            Business Name
          </label>

          <input
            type="text"
            placeholder="Example: Glow Nails"
            value={business}
            onChange={(e) =>
              setBusiness(e.target.value)
            }
            className="w-full border p-3 rounded-lg mb-5"
          />

          <label className="block font-semibold mb-2">
            Service Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full border p-3 rounded-lg mb-5"
          >
            <option value="">
              Select Category
            </option>

            <option value="Nail Technician">
              Nail Technician
            </option>

            <option value="Lash Technician">
              Lash Technician
            </option>

            <option value="Wig Maker">
              Wig Maker
            </option>

            <option value="Barber">
              Barber
            </option>

            <option value="Hair Stylist">
              Hair Stylist
            </option>

            <option value="Makeup Artist">
              Makeup Artist
            </option>

            <option value="Tutor">
              Tutor
            </option>

            <option value="Photographer">
              Photographer
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          <label className="block font-semibold mb-2">
            Location
          </label>

          <input
            type="text"
            placeholder="Example: KNUST Campus"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="w-full border p-3 rounded-lg mb-6"
          />

          <button
            type="button"
            onClick={createProfile}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
          >
            Create Business Profile
          </button>
        </div>
      </main>
    </>
  );
}