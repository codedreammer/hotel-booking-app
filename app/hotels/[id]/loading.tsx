export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>

                        {/* Gallery */}
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 animate-pulse">
                            <div className="col-span-2 row-span-2 bg-gray-200 rounded-xl"></div>
                            <div className="col-span-1 row-span-1 bg-gray-200 rounded-xl"></div>
                            <div className="col-span-1 row-span-1 bg-gray-200 rounded-xl"></div>
                            <div className="col-span-1 row-span-1 bg-gray-200 rounded-xl"></div>
                            <div className="col-span-1 row-span-1 bg-gray-200 rounded-xl"></div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>

                    {/* Booking Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-96 animate-pulse border border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
                            <div className="h-12 bg-gray-200 rounded w-full mb-8"></div>
                            <div className="h-12 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
