"use client";

import { addDays, format, isBefore, startOfDay } from "date-fns";
import { useState, useMemo } from "react";
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

export default function Calendar({ data }: any) {
  const [panel, setPanel] = useState<null | {
    roomId: string;
    roomName: string;
    date: string;
    bookings: any[];
  }>(null);
  const [loading, setLoading] = useState(false);

  // Memoize days to avoid re-calculating on every render
  const days = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)),
    []
  );

  const dayStrings = useMemo(() =>
    days.map(d => format(d, "yyyy-MM-dd")),
    [days]
  );

  const today = startOfDay(new Date());

  // Build occupancy map
  const occupancyMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    if (!data?.bookings) return map;

    const blockingStatuses = ["confirmed", "checked_in"];

    for (const booking of data.bookings) {
      if (!blockingStatuses.includes(booking.status)) continue;

      const bookingDays = getDatesBetween(booking.check_in, booking.check_out);

      for (const day of bookingDays) {
        if (!map[booking.room_id]) {
          map[booking.room_id] = {};
        }

        map[booking.room_id][day] = (map[booking.room_id][day] ?? 0) + 1;
      }
    }
    return map;
  }, [data]);

  if (!data || !Array.isArray(data.rooms)) {
    return (
      <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
        <p className="text-gray-500 dark:text-gray-400 font-medium">No room types found or availability data unavailable.</p>
      </div>
    );
  }

  async function handleCellClick(room: any, date: string) {
    if (loading) return;
    setLoading(true);
    try {
      const bookings = await getBookingsForDate(room.id, date);
      setPanel({
        roomId: room.id,
        roomName: room.rooms_type,
        date,
        bookings: bookings || [],
      });
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshPanel() {
    if (!panel) return;
    setLoading(true);
    try {
      const bookings = await getBookingsForDate(panel.roomId, panel.date);
      setPanel({ ...panel, bookings: bookings || [] });
    } catch (error) {
      console.error("Failed to refresh bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-max flex flex-col">
          {/* Calendar Header */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
            <div className="w-[180px] md:w-[240px] shrink-0 p-4 bg-gray-50 dark:bg-gray-900 font-bold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-800 sticky left-0 z-30 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]">
              Room Types
            </div>
            <div className="flex grow">
              {days.map((date, idx) => (
                <div
                  key={idx}
                  className="w-[64px] md:w-[80px] shrink-0 p-3 bg-gray-50 dark:bg-gray-900 text-center flex flex-col items-center justify-center gap-0.5 border-r border-gray-200 dark:border-gray-800 last:border-r-0"
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                    {format(date, "EEE")}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {format(date, "d")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Body */}
          <div className="flex flex-col">
            {data.rooms.map((room: any) => (
              <div key={room.id} className="flex border-b last:border-b-0 border-gray-200 dark:border-gray-800 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                {/* Room Label - Sticky */}
                <div className="w-[180px] md:w-[240px] shrink-0 p-4 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-center sticky left-0 z-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-900/60 transition-colors shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]">
                  <span className="font-bold text-gray-900 dark:text-white truncate">
                    {room.rooms_type}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {room.total_rooms} rooms total
                  </span>
                </div>

                {/* Date Cells */}
                <div className="flex grow">
                  {dayStrings.map((day, idx) => {
                    const count = occupancyMap[room.id]?.[day] ?? 0;
                    const availableCount = room.total_rooms - count;
                    const isPast = isBefore(new Date(day), today);

                    let colorClass = "bg-emerald-500 hover:bg-emerald-600 shadow-sm ring-1 ring-emerald-600/10";
                    let textColor = "text-white";

                    if (count >= room.total_rooms) {
                      colorClass = "bg-rose-500 hover:bg-rose-600 ring-1 ring-rose-600/10";
                    } else if (count > 0) {
                      colorClass = "bg-amber-400 hover:bg-amber-500 ring-1 ring-amber-500/10";
                      textColor = "text-amber-950 text-opacity-80";
                    }

                    if (isPast) {
                      colorClass = "bg-gray-100 dark:bg-gray-800 opacity-60 cursor-not-allowed";
                      textColor = "text-gray-400 dark:text-gray-500";
                    }

                    return (
                      <div
                        key={day}
                        className="w-[64px] md:w-[80px] shrink-0 p-1.5 border-r last:border-r-0 border-gray-100 dark:border-gray-900 flex items-center justify-center min-h-[72px]"
                      >
                        <button
                          title={`${availableCount} available / ${room.total_rooms} total\n${count} booked`}
                          onClick={() => !isPast && handleCellClick(room, day)}
                          disabled={isPast || loading}
                          className={`w-full h-full rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-0.5 group/cell relative overflow-hidden ${colorClass} ${!isPast ? 'cursor-pointer hover:scale-[1.03] active:scale-95' : ''} ${loading && !isPast ? 'animate-pulse' : ''}`}
                        >
                          <span className={`text-base font-black ${textColor}`}>
                            {availableCount}
                          </span>

                          {!isPast && count > 0 && count < room.total_rooms && (
                            <div className="flex gap-0.5 mt-0.5">
                              {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                                <div key={i} className="w-1 h-1 rounded-full bg-amber-950/20" />
                              ))}
                            </div>
                          )}

                          {!isPast && (
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/cell:opacity-10 transition-opacity pointer-events-none" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
