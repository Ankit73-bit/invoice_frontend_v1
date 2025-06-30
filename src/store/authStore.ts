import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  company: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
