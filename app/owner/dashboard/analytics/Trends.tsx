    "use client";

    import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    } from "recharts";

    export default function Trends({ data }: { data: any[] }) {
    return (
        <div className="border rounded-lg p-4 bg-black">
        <h2 className="text-lg font-semibold mb-2">
            Occupancy Trend (Last {data.length} days)
        </h2>

        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
            <XAxis dataKey="day" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#22c55e"
                strokeWidth={2}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
    }
