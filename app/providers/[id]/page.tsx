import Navbar from "@/components/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type ServiceItem = {
  id: string;
  name: string;
  price: number;
};

type ProviderItem = {
  id: string;
  business: string;
  category: string;
  location: string;
  services: ServiceItem[];
};

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const provider = (await prisma.provider.findUnique({
    where: { id },
    include: { services: true },
  })) as ProviderItem | null;

  if (!provider) return <h1>Provider not found</h1>;

  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="h-56 bg-purple-200 rounded-xl mb-6" />

          <h1 className="text-4xl font-bold">{provider.business}</h1>

          <p className="text-gray-500 mt-2">{provider.category}</p>

          <p className="mb-6">📍 {provider.location}</p>

          <h2 className="text-2xl font-semibold mb-4">Services</h2>

          <div className="space-y-3">
            {provider.services.map((s: ServiceItem) => (
              <div
                key={s.id}
                className="flex justify-between border p-3 rounded-lg"
              >
                <span>{s.name}</span>
                <span>GH₵{s.price}</span>
              </div>
            ))}
          </div>

          <Link
            href={`/booking?provider=${provider.id}`}
            className="block text-center mt-8 bg-purple-600 text-white py-3 rounded-lg"
          >
            Book Appointment
          </Link>
        </div>
      </main>
    </>
  );
}