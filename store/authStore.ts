"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUserProfile, loginWithSupabase, logoutFromSupabase, registerWithSupabase, sendPasswordReset, updateCurrentUserProfile } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase/client";
import type { AppLanguage, AuthUser, HSKLevel } from "@/types";
import { synchronizeLearningProgress } from "@/utils/supabaseProgressSync";

type AuthState = {
  user: AuthUser | null;
  hasHydrated: boolean;
  authError: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (user: { name: string; email: string; password: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: { name: string; currentHSKLevel: HSKLevel; dailyGoalMinutes: number; preferredLanguage: AppLanguage }) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  setHydrated: (value: boolean) => void;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs = 6500) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error("Sessiya tekshiruvi vaqti tugadi.")), timeoutMs);
    })
  ]);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hasHydrated: false,
      authError: null,
      initializeAuth: async () => {
        const { configured } = getSupabaseConfig();
        if (!configured) {
          console.warn("HanziFlow AI: Supabase env qiymatlari topilmadi. Ochiq sahifalar ishlaydi, himoyalangan sahifalar login talab qiladi.");
          set({ user: null, hasHydrated: true, authError: "Supabase sozlamalari topilmadi." });
          return;
        }

        try {
          const user = await withTimeout(getCurrentUserProfile());
          set({ user, hasHydrated: true, authError: null });
          if (user) void synchronizeLearningProgress(user.id);
        } catch (error) {
          set({ user: null, hasHydrated: true, authError: error instanceof Error ? error.message : "Auth xatosi" });
        }
      },
      login: async (input) => {
        const user = await loginWithSupabase(input);
        set({ user, authError: null, hasHydrated: true });
        void synchronizeLearningProgress(user.id);
      },
      register: async ({ name, email, password }) => {
        const user = await registerWithSupabase({ name, email, password });
        set({ user, authError: null, hasHydrated: true });
        void synchronizeLearningProgress(user.id);
      },
      forgotPassword: async (email) => {
        await sendPasswordReset(email);
        set({ authError: null });
      },
      logout: async () => {
        const { configured } = getSupabaseConfig();
        try {
          if (configured) {
            await logoutFromSupabase();
          }
        } finally {
          set({ user: null, authError: null, hasHydrated: true });
        }
      },
      updateProfile: async (input) => {
        const current = get().user;
        if (!current) throw new Error("Sessiya topilmadi.");
        const fallbackUser: AuthUser = {
          ...current,
          name: input.name,
          currentHSKLevel: input.currentHSKLevel,
          dailyGoalMinutes: input.dailyGoalMinutes
        };

        try {
          const updated = await updateCurrentUserProfile({
            id: current.id,
            email: current.email,
            ...input
          });
          set({ user: updated, authError: null });
          return true;
        } catch {
          set({ user: fallbackUser, authError: null });
          if (typeof window !== "undefined") {
            window.localStorage.setItem("hanziflow-profile-fallback", JSON.stringify({
              name: input.name,
              currentHSKLevel: input.currentHSKLevel,
              dailyGoalMinutes: input.dailyGoalMinutes,
              preferredLanguage: input.preferredLanguage,
              updatedAt: new Date().toISOString()
            }));
          }
          return false;
        }
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
