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

        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-6">
          <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md w-full border border-purple-100">
            <div className="text-5xl mb-4">
              😕
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Provider not found
            </h1>

            <p className="text-gray-500 mt-2 mb-6">
              This service provider could not be found.
            </p>

            <Link
              href="/providers"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Back to Providers
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

        <div className="max-w-5xl mx-auto px-5 py-10 md:py-14">

          {/* BACK LINK */}
          <div className="mb-5">
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 text-purple-700 font-medium hover:text-purple-900 transition"
            >
              <span>←</span>
              Back to Providers
            </Link>
          </div>

          {/* MAIN CARD */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100">

            {/* PROVIDER IMAGE */}
            <div className="relative w-full h-72 md:h-96">

              <Image
                src={getProviderImage(
                  provider.category
                )}
                alt={provider.business}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />

              {/* IMAGE GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* CATEGORY BADGE */}
              <div className="absolute left-6 bottom-6">
                <span className="bg-white/95 backdrop-blur text-purple-700 px-4 py-2 rounded-full font-semibold shadow-lg text-sm">
                  {provider.category}
                </span>
              </div>

            </div>

            {/* CONTENT */}
            <div className="p-6 md:p-10">

              {/* PROVIDER INFO */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                <div>

                  <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">
                    Service Provider
                  </p>

                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                    {provider.business}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mt-4">

                    <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                      ✨ {provider.category}
                    </span>

                    <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                      📍 {provider.location}
                    </span>

                  </div>

                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 min-w-[170px]">

                  <p className="text-sm text-gray-500">
                    Available Services
                  </p>

                  <p className="text-3xl font-bold text-purple-700 mt-1">
                    {provider.services.length}
                  </p>

                </div>

              </div>

              {/* DIVIDER */}
              <div className="border-t border-gray-100 my-8" />

              {/* SERVICES HEADER */}
              <div className="flex items-end justify-between gap-4 mb-6">

                <div>
                  <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
                    What they offer
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                    Services
                  </h2>
                </div>

              </div>

              {/* SERVICES */}
              <div className="grid gap-4">

                {provider.services.map(
                  (service) => (
                    <div
                      key={service.id}
                      className="group border border-gray-200 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-purple-300 hover:shadow-md hover:bg-purple-50/30 transition"
                    >

                      <div className="flex items-start gap-4">

                        <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl shrink-0">
                          ✨
                        </div>

                        <div>

                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition">
                            {service.name}
                          </h3>

                          <p className="text-gray-500 mt-1 text-sm">
                            ⏱ {service.duration} minutes
                          </p>

                        </div>

                      </div>

                      <div className="sm:text-right">

                        <p className="text-sm text-gray-500">
                          Price
                        </p>

                        <p className="text-2xl font-bold text-purple-700">
                          GH₵{service.price}
                        </p>

                      </div>

                    </div>
                  )
                )}

                {provider.services.length === 0 && (
                  <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-2xl p-10 text-center">

                    <div className="text-4xl mb-3">
                      📋
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800">
                      No services yet
                    </h3>

                    <p className="text-gray-500 mt-1">
                      This provider has not added any services yet.
                    </p>

                  </div>
                )}

              </div>

              {/* BOOKING CTA */}
              {provider.services.length > 0 && (
                <div className="mt-10 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div className="text-white">

                    <h3 className="text-xl md:text-2xl font-bold">
                      Ready to book?
                    </h3>

                    <p className="text-purple-100 mt-1">
                      Select a service, date and available time to schedule your appointment.
                    </p>

                  </div>

                  <Link
                    href={`/booking?provider=${provider.id}`}
                    className="bg-white text-purple-700 px-7 py-3.5 rounded-xl text-center font-bold hover:bg-purple-50 transition shadow-lg whitespace-nowrap"
                  >
                    Book Appointment
                  </Link>

                </div>
              )}

            </div>

          </div>

        </div>

      </main>
    </>
  );
}