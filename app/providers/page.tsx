import Navbar from "@/components/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type ProviderItem = {
  id: string;
  business: string;
  category: string;
  location: string;
};

export default async function ProvidersPage() {
  const providers = (await prisma.provider.findMany()) as ProviderItem[];

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Service Providers</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {providers.map((p: ProviderItem) => (
            <div key={p.id} className="card p-5">
              <div className="h-40 rounded-xl bg-purple-100 mb-4" />

              <h2 className="text-xl font-bold">{p.business}</h2>
              <p className="text-gray-500">{p.category}</p>
              <p className="mt-2">{p.location}</p>

              <Link
                href={`/providers/${p.id}`}
                className="block mt-4 text-center bg-purple-600 text-white py-2 rounded-lg"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}