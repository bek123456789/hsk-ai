"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUserProfile, loginWithSupabase, logoutFromSupabase, registerWithSupabase, sendPasswordReset } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase/client";
import type { AuthUser } from "@/types";

type AuthState = {
  user: AuthUser | null;
  hasHydrated: boolean;
  authError: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (user: { name: string; email: string; password: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      authError: null,
      initializeAuth: async () => {
        const { configured } = getSupabaseConfig();
        if (!configured) {
          set({ user: null, hasHydrated: true, authError: "Supabase sozlamalari topilmadi." });
          return;
        }

        try {
          const user = await getCurrentUserProfile();
          set({ user, hasHydrated: true, authError: null });
        } catch (error) {
          set({ user: null, hasHydrated: true, authError: error instanceof Error ? error.message : "Auth xatosi" });
        }
      },
      login: async (input) => {
        const user = await loginWithSupabase(input);
        set({ user, authError: null, hasHydrated: true });
      },
      register: async ({ name, email, password }) => {
        const user = await registerWithSupabase({ name, email, password });
        set({ user, authError: null, hasHydrated: true });
      },
      forgotPassword: async (email) => {
        await sendPasswordReset(email);
        set({ authError: null });
      },
      logout: async () => {
        const { configured } = getSupabaseConfig();
        if (configured) {
          await logoutFromSupabase();
        }
        set({ user: null, authError: null, hasHydrated: true });
      },
      setHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "hsk-ai-auth",
      onRehydrateStorage: () => (state) => {
        state?.initializeAuth();
      }
    }
  )
);
