"use client";

import { addDays, format } from "date-fns";
import { useState } from "react";
import BookingPanel from "./BookingPanel";
import { getBookingsForDate } from "./action";

function getDatesBetween(start: string, end: string) {
  const dates: string[] = [];
  let current = new Date(start);
  const last = new Date(end);

  while (current < last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function getCellColor(
  roomId: string,
  day: string,
  totalRooms: number,
  occupancyMap: Record<string, Record<string, number>>
) {
  const count = occupancyMap[roomId]?.[day] ?? 0;

  if (count >= totalRooms) return "bg-red-600";
  if (count > 0) return "bg-yellow-500";
  return "bg-green-600";
}

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
  const [loading, setLoading] = useState(false);

  // Build occupancy map
  const occupancyMap: Record<string, Record<string, number>> = {};

  // only block with confirmed / checked_in
  const blockingStatuses = ["confirmed", "checked_in"];

  for (const booking of data.bookings) {
    if (!blockingStatuses.includes(booking.status)) continue;

    const days = getDatesBetween(
      booking.check_in,
      booking.check_out
    );

    for (const day of days) {
      if (!occupancyMap[booking.room_id]) {
        occupancyMap[booking.room_id] = {};
      }

      occupancyMap[booking.room_id][day] =
        (occupancyMap[booking.room_id][day] ?? 0) + 1;
    }
  }

  async function handleCellClick(room: any, date: string) {
    setLoading(true);
    const bookings = await getBookingsForDate(room.id, date);
    setPanel({
      roomId: room.id,
      roomName: room.rooms_type,
      date,
      bookings,
    });
    setLoading(false);
  }

  async function refreshPanel() {
    if (!panel) return;
    setLoading(true);
    const bookings = await getBookingsForDate(panel.roomId, panel.date);
    setPanel({ ...panel, bookings });
    setLoading(false);
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
              const count = occupancyMap[room.id]?.[day] ?? 0;
              const color = getCellColor(room.id, day, room.total_rooms, occupancyMap);

              return (
                <div
                  key={day}
                  title={`${count}/${room.total_rooms} booked`}
                  onClick={() => handleCellClick(room, day)}
                  className={`h-8 rounded cursor-pointer ${color} ${loading ? 'opacity-50' : ''}`}
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
          refresh={refreshPanel}
        />
      )}
    </div>
  );
}
