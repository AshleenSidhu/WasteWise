"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ReportPage() {
  const [binId, setBinId] = useState("bin_001");
  const [note, setNote] = useState("");
  const [reportType, setReportType] = useState("overflow");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          binId,
          note,
          reportType,
          lat: 51.045,
          lon: -114.057,
        }),
      });
      const data = await res.json();
      alert(`✅ Report created successfully! ID: ${data.reportId || JSON.stringify(data)}`);
      // Reset form
      setBinId("bin_001");
      setNote("");
      setReportType("overflow");
    } catch (error) {
      alert("❌ Error submitting report. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="text-6xl animate-bounce-slow">📸</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Report Overflow
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help keep your neighborhood clean by reporting bins that need attention
          </p>
        </div>

        {/* Report Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-6"
          >
            {/* Report Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Report Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setReportType("overflow")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    reportType === "overflow"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="text-3xl mb-2">🗑️</div>
                  <div className="font-medium text-sm text-gray-700">Overflow</div>
                </button>
                <button
                  type="button"
                  onClick={() => setReportType("damaged")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    reportType === "damaged"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="text-3xl mb-2">🔧</div>
                  <div className="font-medium text-sm text-gray-700">Damaged</div>
                </button>
                <button
                  type="button"
                  onClick={() => setReportType("missing")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    reportType === "missing"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="text-3xl mb-2">❓</div>
                  <div className="font-medium text-sm text-gray-700">Missing</div>
                </button>
              </div>
            </div>

            {/* Bin ID */}
            <div>
              <label
                htmlFor="binId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Bin ID
              </label>
              <input
                id="binId"
                type="text"
                value={binId}
                onChange={(e) => setBinId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                placeholder="e.g., bin_001"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Find the bin ID on the map or on the bin itself
              </p>
            </div>

            {/* Note */}
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Additional Notes
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-400"
                placeholder="Describe the issue... (e.g., 'Bin is overflowing with cardboard boxes')"
              />
            </div>

            {/* Photo Upload Placeholder */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo (Coming Soon!)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500 text-sm">
                  Photo upload feature coming soon
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Report"
                )}
              </button>
              <Link
                href="/"
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Quick Tip</h3>
                <p className="text-sm text-gray-700">
                  Be as specific as possible in your description to help maintenance teams respond quickly!
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/map"
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗺️</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Find Bins</h3>
                <p className="text-sm text-gray-700">
                  Not sure about the bin ID? Check the map to find bins near you
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Mascot Encouragement */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-lg px-6 py-4 max-w-md animate-float">
            <div className="relative">
              <p className="text-gray-700 flex items-center gap-2">
                <span className="text-2xl">♻️</span>
                <span className="italic">
                  &quot;Thank you for helping keep our community clean! Every report makes a difference! 💚&quot;
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
