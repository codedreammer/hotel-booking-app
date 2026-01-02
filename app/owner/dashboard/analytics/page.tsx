import { getOwnerAnalytics, getOccupancyTrend } from "./actions";
import Trends from "./Trends";

    export default async function AnalyticsPage() {
    const stats = await getOwnerAnalytics(30);
    const trend = await getOccupancyTrend(7);

    if (!stats) return <p className="p-6">No data yet.</p>;

    return (
        <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Occupancy (30 days)" value={`${stats.occupancy}%`} />
        <Card title="Upcoming bookings" value={stats.upcoming} />
        <Card title="Past bookings" value={stats.past} />
        <Card title="Rooms" value={stats.rooms} />
    </div>

        <Trends data={trend} />
        </div>
    );
    }

    function Card({ title, value }: { title: string; value: any }) {
    return (
        <div className="border rounded-lg p-4 bg-black">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
    }
