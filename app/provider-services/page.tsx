"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ServiceItem = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export default function ProviderServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<ServiceItem[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const [userId, setUserId] = useState("");
  const [business, setBusiness] = useState("");

  const [loading, setLoading] = useState(true);

  // EDIT STATES
  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // LOAD SERVICES
  useEffect(() => {
    const loadServices = async () => {
      const storedUser = localStorage.getItem("user");

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
          `/api/services?userId=${user.id}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Could not load services.");
          setLoading(false);
          return;
        }

        setServices(data.services);
        setBusiness(data.provider.business);
      } catch (error) {
        console.error("LOAD SERVICES ERROR:", error);

        alert("Something went wrong.");
      }

      setLoading(false);
    };

    loadServices();
  }, [router]);

  // ADD SERVICE
  const addService = async () => {
    if (!name || !price || !duration) {
      alert("Please complete all fields.");
      return;
    }

    if (Number(price) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    if (Number(duration) <= 0) {
      alert("Duration must be greater than 0.");
      return;
    }

    try {
      const res = await fetch("/api/services", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId,
          name,
          price,
          duration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not add service.");
        return;
      }

      setServices((current) => [...current, data]);

      setName("");
      setPrice("");
      setDuration("");

      alert("Service added successfully!");
    } catch (error) {
      console.error("ADD SERVICE ERROR:", error);

      alert("Something went wrong.");
    }
  };

  // START EDITING
  const startEditing = (service: ServiceItem) => {
    setEditingId(service.id);

    setEditName(service.name);
    setEditPrice(service.price.toString());
    setEditDuration(service.duration.toString());
  };

  // CANCEL EDITING
  const cancelEditing = () => {
    setEditingId(null);

    setEditName("");
    setEditPrice("");
    setEditDuration("");
  };

  // UPDATE SERVICE
  const updateService = async (serviceId: string) => {
    if (!editName || !editPrice || !editDuration) {
      alert("Please complete all fields.");
      return;
    }

    if (Number(editPrice) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    if (Number(editDuration) <= 0) {
      alert("Duration must be greater than 0.");
      return;
    }

    try {
      const res = await fetch(
        `/api/services/${serviceId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            name: editName,
            price: editPrice,
            duration: editDuration,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not update service.");
        return;
      }

      setServices((current) =>
        current.map((service) =>
          service.id === serviceId ? data : service
        )
      );

      cancelEditing();

      alert("Service updated successfully!");
    } catch (error) {
      console.error("UPDATE SERVICE ERROR:", error);

      alert("Something went wrong.");
    }
  };

  // DELETE SERVICE
  const deleteService = async (serviceId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `/api/services/${serviceId}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not delete service.");
        return;
      }

      setServices((current) =>
        current.filter(
          (service) => service.id !== serviceId
        )
      );

      alert("Service deleted successfully!");
    } catch (error) {
      console.error("DELETE SERVICE ERROR:", error);

      alert("Something went wrong.");
    }
  };

  // LOADING
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-purple-50 p-8">
          <div className="max-w-5xl mx-auto">
            <p>Loading services...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-purple-50">
        <div className="max-w-5xl mx-auto p-8">

          {/* HEADER */}

          <h1 className="text-4xl font-bold">
            Manage Services
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            {business}
          </p>

          {/* ADD SERVICE */}

          <div className="bg-white shadow rounded-xl p-6 mb-10">

            <h2 className="text-2xl font-bold mb-2">
              Add New Service
            </h2>

            <p className="text-gray-500 mb-5">
              Add the services that students can book.
            </p>

            <div className="grid md:grid-cols-3 gap-4">

              {/* SERVICE NAME */}

              <div>
                <label className="block font-semibold mb-2">
                  Service Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Manicure"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              {/* PRICE */}

              <div>
                <label className="block font-semibold mb-2">
                  Price
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="GH₵"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              {/* DURATION */}

              <div>
                <label className="block font-semibold mb-2">
                  Duration
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Minutes"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  className="w-full border p-3 rounded-lg"
                />
              </div>

            </div>

            <button
              type="button"
              onClick={addService}
              className="mt-5 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Add Service
            </button>

          </div>

          {/* SERVICE LIST */}

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-2xl font-bold">
              My Services
            </h2>

            <span className="text-gray-500">
              {services.length} service
              {services.length !== 1 ? "s" : ""}
            </span>

          </div>

          <div className="space-y-4">

            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white shadow rounded-xl p-5"
              >

                {/* EDIT MODE */}

                {editingId === service.id ? (
                  <div>

                    <h3 className="font-bold text-lg mb-4">
                      Edit Service
                    </h3>

                    <div className="grid md:grid-cols-3 gap-3">

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Name
                        </label>

                        <input
                          type="text"
                          value={editName}
                          onChange={(e) =>
                            setEditName(e.target.value)
                          }
                          className="w-full border p-3 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Price
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={editPrice}
                          onChange={(e) =>
                            setEditPrice(e.target.value)
                          }
                          className="w-full border p-3 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Duration
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={editDuration}
                          onChange={(e) =>
                            setEditDuration(
                              e.target.value
                            )
                          }
                          className="w-full border p-3 rounded-lg"
                        />
                      </div>

                    </div>

                    <div className="flex gap-2 mt-4">

                      <button
                        type="button"
                        onClick={() =>
                          updateService(service.id)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                ) : (

                  /* NORMAL DISPLAY MODE */

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>

                      <h3 className="font-bold text-xl">
                        {service.name}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {service.duration} minutes
                      </p>

                      <p className="font-semibold text-lg mt-2">
                        GH₵{service.price}
                      </p>

                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          startEditing(service)
                        }
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteService(service.id)
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ))}

            {/* NO SERVICES */}

            {services.length === 0 && (
              <div className="bg-white shadow rounded-xl p-10 text-center">

                <h3 className="text-xl font-semibold mb-2">
                  No services yet
                </h3>

                <p className="text-gray-500">
                  Add your first service using the form
                  above.
                </p>

              </div>
            )}

          </div>

        </div>
      </main>
    </>
  );
}