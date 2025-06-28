import { create } from "zustand";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  company: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, token: null }),
}));
