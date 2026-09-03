"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProviderSetupPage() {
  const router = useRouter();

  const [business, setBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "PROVIDER") {
        router.push("/providers");
        return;
      }

      setUserId(user.id);
    } catch (error) {
      console.error("USER ERROR:", error);

      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  const createProfile = async () => {
    if (
      !business.trim() ||
      !category ||
      !location.trim() ||
      !phone.trim()
    ) {
      alert("Please complete all fields.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/provider-profile", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId,
          business: business.trim(),
          category,
          location: location.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Could not create provider profile."
        );

        setSaving(false);
        return;
      }

      alert(
        "Business profile created successfully!"
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(
        "CREATE PROVIDER PROFILE ERROR:",
        error
      );

      alert("Something went wrong.");
    }

    setSaving(false);
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
            Add information about your service business.
          </p>

          {/* BUSINESS NAME */}

          <label className="block font-semibold mb-2">
            Business Name
          </label>

          <input
            type="text"
            placeholder="Example: LGraphics"
            value={business}
            onChange={(e) =>
              setBusiness(e.target.value)
            }
            className="w-full border p-3 rounded-lg mb-5"
          />

          {/* CATEGORY */}

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

            <option value="Photographer">
              Photographer
            </option>

            <option value="Tutor">
              Tutor
            </option>

            <option value="Graphic Designer">
              Graphic Designer
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* LOCATION */}

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
            className="w-full border p-3 rounded-lg mb-5"
          />

          {/* PHONE */}

          <label className="block font-semibold mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="Example: 0241234567"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full border p-3 rounded-lg mb-6"
          />

          {/* CREATE BUTTON */}

          <button
            type="button"
            onClick={createProfile}
            disabled={saving}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Creating Profile..."
              : "Create Business Profile"}
          </button>

        </div>
      </main>
    </>
  );
}