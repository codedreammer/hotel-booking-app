    "use client";

    import { addDays, format } from "date-fns";

    export default function Calendar({ data }: any) {
    const days = Array.from({ length: 14 }, (_, i) =>
        format(addDays(new Date(), i), "yyyy-MM-dd")
    );

    return (
        <div className="space-y-6">
        {data.rooms.map((room: any) => {
            return (
            <div key={room.id}>
                <h3 className="font-semibold mb-2">
                {room.rooms_type} ({room.total_rooms})
                </h3>

                <div className="grid grid-cols-14 gap-1">
                {days.map(day => {
                    const count = data.bookings.filter(
                    (b: any) =>
                        b.room_id === room.id &&
                        b.check_in <= day &&
                        b.check_out > day
                    ).length;

                    let color = "bg-green-600";
                    if (count >= room.total_rooms) color = "bg-red-600";
                    else if (count > 0) color = "bg-yellow-500";

                    return (
                    <div
                        key={day}
                        title={`${day} – ${count}/${room.total_rooms}`}
                        className={`h-8 rounded ${color}`}
                    />
                    );
                })}
                </div>
            </div>
            );
        })}
        </div>
    );
    }
