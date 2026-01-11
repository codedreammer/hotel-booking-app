export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header Skeleton */}
                <div className="animate-pulse mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="w-full md:w-auto h-12 bg-white border border-gray-200 rounded-xl"></div>
                </div>

                {/* List Skeleton */}
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row animate-pulse">
                            <div className="md:w-72 h-48 md:h-auto bg-gray-200"></div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
