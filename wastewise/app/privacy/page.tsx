export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: November 9, 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Introduction</h2>
              <p className="text-gray-700">
                WasteWise (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when 
                you use our waste management platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Information We Collect</h2>
              <p className="text-gray-700 mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Location data when using the bin locator feature</li>
                <li>Report details (bin IDs, notes, photos)</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process and respond to your reports</li>
                <li>Show you relevant bin locations</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about updates and features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Rights</h2>
              <p className="text-gray-700 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at privacy@wastewise.com
              </p>
            </section>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mt-8">
              <p className="text-center text-gray-700 flex items-center justify-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span className="italic">
                  &quot;Your privacy and trust are important to us. We&apos;re committed to keeping your data safe!&quot;
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
