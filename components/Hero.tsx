import Link from "next/link";

export default function Hero(){
  return(
    <section className="hero-gradient text-white py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Book Campus Services in Seconds
          </h1>

          <p className="mt-6 text-lg text-purple-100">
            Find nail technicians, wig makers, lash techs,
            barbers and other student entrepreneurs.
          </p>

          <Link
            href="/providers"
            className="inline-block mt-8 bg-white text-purple-700 px-7 py-3 rounded-xl font-semibold"
          >
            Book Appointment
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 text-gray-800 shadow-2xl">
          <h3 className="font-bold text-xl mb-4">
            Today's Schedule
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between bg-purple-50 p-3 rounded-lg">
              <span>Glow Nails</span>
              <span>10:00 AM</span>
            </div>

            <div className="flex justify-between bg-pink-50 p-3 rounded-lg">
              <span>Bella Lashes</span>
              <span>12:30 PM</span>
            </div>

            <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
              <span>Kings Barber</span>
              <span>3:00 PM</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}