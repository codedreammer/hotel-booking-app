import Link from "next/link"

export default function AddHotelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/owner/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ← Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Your First Hotel
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Add Your First Hotel
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start building your hotel portfolio by adding your first property. 
              You'll be able to manage rooms, pricing, and bookings once your hotel is set up.
            </p>
          </div>

          {/* Placeholder for future hotel form */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Hotel Form Coming Soon
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              The hotel creation form will be implemented here with fields for hotel details, 
              location, amenities, and initial room setup.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/owner/dashboard"
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}