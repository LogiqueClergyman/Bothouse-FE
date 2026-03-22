"use client";
import { Navbar } from "@/components/layout/Navbar";
import { RoomFilters } from "@/components/lobby/RoomFilters";
import { RoomList } from "@/components/lobby/RoomList";
import { CreateRoomButton } from "@/components/lobby/CreateRoomButton";

export default function LobbyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Game Lobby</h1>
          <CreateRoomButton />
        </div>
        <RoomFilters />
        <RoomList />
      </main>
    </div>
  );
}
