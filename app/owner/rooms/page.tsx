import Link from "next/link"

export default function OwnerRooms() {
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
                Rooms Management
              </h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add New Room
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛏️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Room Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Manage room types, availability, and pricing across all your hotels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Room Types & Pricing</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure different room categories and rates</p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Availability Calendar</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage room availability and blocked dates</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}