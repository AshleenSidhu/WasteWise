import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/1.svg"
              alt="WasteWise Logo"
              width={400}
              height={400}
              className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-lg"
              priority
            />
          </div>

          {/* Tagline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Turning waste sorting into a<br />smarter, greener adventure!
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            WasteWise helps communities find, report, and manage waste and recycling bins 
            through smart maps and real-time updates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/map"
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Explore the Map</span>
            </Link>
            <Link
              href="/report"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-500 rounded-full font-semibold text-lg hover:bg-green-50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Report Overflow</span>
            </Link>
          </div>

          {/* Mascot Talk Bubble */}
          <div className="mt-16 inline-block">
            <div className="relative bg-white rounded-2xl shadow-lg px-6 py-4 max-w-md">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
              <p className="text-gray-700 flex items-center gap-2">
                <span className="text-2xl">♻️</span>
                <span className="italic">&quot;Let&apos;s make our planet cleaner together!&quot;</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
                Smart Bin Locator
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Find nearby waste and recycling bins, see their status, or help keep them clean 
                by reporting issues. Our interactive map shows real-time bin locations and conditions.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">View all nearby bins in real-time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Check bin capacity and type</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Get directions to the nearest bin</span>
                </li>
              </ul>
              <Link
                href="/map"
                className="inline-block px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 hover:shadow-lg transition-all"
              >
                Open Full Map
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-green-100">
                <Image
                  src="/map.png"
                  alt="Smart Bin Locator Map"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                {/* Overlay shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the WasteWise community in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                ♻️
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Locate Bins</h3>
              <p className="text-gray-600">
                See all nearby recycling, compost, and waste bins on our interactive map. 
                Never wonder where to dispose of your waste again!
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                📸
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Report Overflow</h3>
              <p className="text-gray-600">
                Snap a photo or mark bins that need attention. Help keep your community clean 
                by reporting issues in real-time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                🌍
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Earn Green Points</h3>
              <p className="text-gray-600">
                Every report helps make your neighborhood cleaner! Earn points and contribute 
                to a healthier planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section id="community" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Community Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Together, we&apos;re making a real difference in our neighborhoods
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-green-600 mb-2">327</div>
              <div className="text-gray-700 font-semibold">Reports Submitted</div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-bold text-blue-600 mb-2">298</div>
              <div className="text-gray-700 font-semibold">Issues Resolved</div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center transform hover:scale-105 transition-all sm:col-span-2 md:col-span-1">
              <div className="text-5xl font-bold text-purple-600 mb-2">120+</div>
              <div className="text-gray-700 font-semibold">Active Members</div>
            </div>
          </div>

          {/* Community Illustration */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-12 shadow-lg">
              <p className="text-2xl mb-6 text-gray-700 italic">
                &quot;Every small action creates a ripple of positive change!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
