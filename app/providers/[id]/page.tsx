import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

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

function getProviderImage(category: string) {
  const value = category.toLowerCase();

  if (value.includes("nail")) {
    return "/providers/nails.png";
  }

  if (value.includes("lash")) {
    return "/providers/lashes.png";
  }

  if (value.includes("graphic")) {
    return "/providers/graphics.png";
  }

  if (value.includes("barber")) {
    return "/providers/barber.png";
  }

  if (
    value.includes("hair") ||
    value.includes("wig")
  ) {
    return "/providers/hair.png";
  }

  if (value.includes("makeup")) {
    return "/providers/makeup.png";
  }

  if (
    value.includes("photo") ||
    value.includes("photographer")
  ) {
    return "/providers/photography.png";
  }

  return "/providers/default.png";
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const provider =
    (await prisma.provider.findUnique({
      where: {
        id,
      },

      include: {
        services: true,
      },
    })) as ProviderItem | null;

  if (!provider) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-purple-50 flex items-center justify-center">
          <h1 className="text-2xl font-bold">
            Provider not found
          </h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-purple-50 py-10 px-6">

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* PROVIDER IMAGE */}
          <div className="relative w-full h-80">
            <Image
              src={getProviderImage(
                provider.category
              )}
              alt={provider.business}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* PROVIDER INFORMATION */}
          <div className="p-8">

            <h1 className="text-4xl font-bold">
              {provider.business}
            </h1>

            <p className="text-gray-500 text-lg mt-2">
              {provider.category}
            </p>

            <p className="mt-2 text-lg">
              📍 {provider.location}
            </p>

            {/* SERVICES */}
            <h2 className="text-2xl font-bold mt-8 mb-4">
              Services
            </h2>

            <div className="space-y-3">

              {provider.services.map(
                (service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-center border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {service.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {service.duration} minutes
                      </p>
                    </div>

                    <span className="font-semibold">
                      GH₵{service.price}
                    </span>
                  </div>
                )
              )}

              {provider.services.length === 0 && (
                <div className="border rounded-xl p-5 text-center">
                  <p className="text-gray-500">
                    This provider has not added any services yet.
                  </p>
                </div>
              )}

            </div>

            {/* BOOK BUTTON */}
            <Link
              href={`/booking?provider=${provider.id}`}
              className="block text-center mt-8 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Book Appointment
            </Link>

          </div>

        </div>

      </main>
    </>
  );
}