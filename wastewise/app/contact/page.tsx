export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-bounce-slow">📧</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We&apos;d love to hear from you!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Send Message 💚
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700">hello@wastewise.com</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-gray-900 mb-2">Social</h3>
            <p className="text-gray-700">@wastewise</p>
          </div>
        </div>
      </div>
    </div>
  );
}
