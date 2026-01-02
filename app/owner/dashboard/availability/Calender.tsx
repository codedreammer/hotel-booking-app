"use client";

import { addDays, format } from "date-fns";
import { useState } from "react";
import BookingPanel from "./BookingPanel";
import { getBookingsForDate } from "./action";

export default function Calendar({ data }: any) {
  if (!data || !Array.isArray(data.rooms)) {
    return <p className="text-gray-400">No availability data.</p>;
  }

  const days = Array.from({ length: 14 }, (_, i) =>
    format(addDays(new Date(), i), "yyyy-MM-dd")
  );

  const [panel, setPanel] = useState<null | {
    roomId: string;
    roomName: string;
    date: string;
    bookings: any[];
  }>(null);

  async function handleCellClick(room: any, date: string) {
    const bookings = await getBookingsForDate(room.id, date);
    setPanel({
      roomId: room.id,
      roomName: room.rooms_type,
      date,
      bookings,
    });
  }

  return (
    <div className="space-y-6 relative">
      {data.rooms.map((room: any) => (
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
                  onClick={() => handleCellClick(room, day)}
                  className={`h-8 rounded cursor-pointer ${color}`}
                />
              );
            })}
          </div>
        </div>
      ))}

      {panel && (
        <BookingPanel
          roomName={panel.roomName}
          date={panel.date}
          bookings={panel.bookings}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}
