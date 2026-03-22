import { create } from "zustand";
import type { RoomWithSeats } from "@/types";

interface LobbyState {
  rooms: RoomWithSeats[];
  filters: { game_type?: string; status: string };
  setRooms: (rooms: RoomWithSeats[]) => void;
  setFilters: (filters: Partial<LobbyState["filters"]>) => void;
}

export const useLobbyStore = create<LobbyState>()((set) => ({
  rooms: [],
  filters: { status: "open" },
  setRooms: (rooms) => set({ rooms }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
