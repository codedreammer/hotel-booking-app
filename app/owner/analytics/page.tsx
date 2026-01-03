import Link from "next/link"

export default function OwnerAnalytics() {
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
                Analytics
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Performance metrics and insights will be available here soon.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Revenue Tracking</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your earnings and booking trends</p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Occupancy Rates</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track room utilization and availability</p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Guest Insights</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Understand your guest demographics</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}