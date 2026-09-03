import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type ProviderItem = {
  id: string;
  business: string;
  category: string;
  location: string;
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

export default async function ProvidersPage() {
  const providers =
    (await prisma.provider.findMany()) as ProviderItem[];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-purple-50">
        <div className="max-w-6xl mx-auto p-8">

          <h1 className="text-4xl font-bold mb-8">
            Service Providers
          </h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                {/* PROVIDER IMAGE */}
                <div className="relative w-full h-52">
                  <Image
                    src={getProviderImage(
                      provider.category
                    )}
                    alt={provider.business}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>

                {/* PROVIDER INFORMATION */}
                <div className="p-5">

                  <h2 className="text-2xl font-bold">
                    {provider.business}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {provider.category}
                  </p>

                  <p className="mt-3">
                    📍 {provider.location}
                  </p>

                  <Link
                    href={`/providers/${provider.id}`}
                    className="block mt-5 text-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    View Profile
                  </Link>

                </div>
              </div>
            ))}

            {providers.length === 0 && (
              <div className="col-span-full bg-white rounded-xl shadow p-10 text-center">
                <p className="text-gray-500">
                  No service providers available yet.
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  );
}