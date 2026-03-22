import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: { user_id: string; wallet: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: { user_id: string; wallet: string }, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "bothouse_auth" }
  )
);
