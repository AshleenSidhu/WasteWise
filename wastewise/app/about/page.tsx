export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About WasteWise</h1>
          <p className="text-xl text-gray-600">Making waste management smarter, one bin at a time</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission 🌱</h2>
            <p className="text-gray-700 mb-6">
              WasteWise is dedicated to creating cleaner, more sustainable communities through smart 
              waste management technology. We believe that by making it easier to find and report 
              waste bins, we can encourage better recycling habits and keep our neighborhoods cleaner.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do ♻️</h2>
            <p className="text-gray-700 mb-6">
              Our platform combines interactive mapping, community reporting, and real-time updates 
              to help people find the right bins for their waste and keep track of bin status. 
              Whether you&apos;re looking for a recycling bin, need to report an overflow, or want to 
              contribute to a cleaner environment, WasteWise makes it simple.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Team 👥</h2>
            <p className="text-gray-700 mb-6">
              WasteWise is built by a passionate team of developers and environmental enthusiasts 
              who want to make a positive impact on our planet. We&apos;re constantly working to improve 
              the platform and add new features based on community feedback.
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mt-8">
              <p className="text-center text-gray-700 flex items-center justify-center gap-2">
                <span className="text-2xl">💚</span>
                <span className="italic">
                  &quot;Together, we can make a difference in our communities and our planet!&quot;
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
