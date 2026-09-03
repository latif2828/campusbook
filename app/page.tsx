import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProviderCard from "@/components/ProviderCard";

export default function Home(){

  return(
    <>
      <Navbar/>

      <Hero/>

      <section className="max-w-6xl mx-auto py-16 px-6">

        <h2 className="text-3xl font-bold mb-8">
          Popular Service Providers
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <ProviderCard
            name="Glow Nails"
            category="Nail Technician"
            price="From GH₵40"
          />

          <ProviderCard
            name="Bella Lashes"
            category="Lash Technician"
            price="GH₵60"
          />

          <ProviderCard
            name="Kurl Studio"
            category="Wig Maker"
            price="From GH₵80"
          />

        </div>

      </section>

      <section className="bg-white py-16 mt-12">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold">
            How CampusBook Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">

            <div>
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-semibold">Find a Provider</h3>
            </div>

            <div>
              <div className="text-5xl mb-3">📅</div>
              <h3 className="font-semibold">Choose a Time</h3>
            </div>

            <div>
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-semibold">Get Confirmed</h3>
            </div>

          </div>

        </div>

      </section>
    </>
  )
}