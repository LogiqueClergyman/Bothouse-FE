"use client";
import { useLobbyStore } from "@/stores/lobbyStore";
import { usePolling } from "@/hooks/usePolling";
import { createApi } from "@/lib/api";
import type { RoomWithSeats } from "@/types";
import { RoomCard } from "./RoomCard";

export function RoomList() {
  const { filters, setRooms } = useLobbyStore();
  const rooms = useLobbyStore((s) => s.rooms);

  usePolling<RoomWithSeats[]>(
    ["rooms", filters],
    async () => {
      const api = createApi();
      const list = await api.listRooms(filters);
      setRooms(list);
      return list;
    },
    5_000
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard key={room.room_id} room={room} />
      ))}
      {rooms.length === 0 && (
        <div className="col-span-3 text-center py-12 text-gray-400">No open rooms. Create one!</div>
      )}
    </div>
  );
}
