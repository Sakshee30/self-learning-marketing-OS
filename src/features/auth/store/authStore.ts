import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SignInInput, SignUpInput } from "../schemas/auth.schema";
import type { AuthStatus, AuthUser } from "../types";

const LEGACY_PREVIEW_KEY = "growthos-demo-auth";

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  signInPreview: (input: SignInInput) => void;
  signUpPreview: (input: SignUpInput) => void;
  signOut: () => void;
};

const legacySignedIn =
  typeof window !== "undefined" && sessionStorage.getItem(LEGACY_PREVIEW_KEY) === "true";

const previewUser: AuthUser = {
  id: "preview-user",
  email: "demo@growthos.local",
  displayName: "Sakshee"
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: legacySignedIn ? "authenticated" : "anonymous",
      user: legacySignedIn ? previewUser : null,
      signInPreview: (input) => {
        sessionStorage.setItem(LEGACY_PREVIEW_KEY, "true");
        set({
          status: "authenticated",
          user: {
            id: "preview-user",
            email: input.email,
            displayName: input.email.split("@")[0] || "GrowthOS user"
          }
        });
      },
      signUpPreview: (input) => {
        sessionStorage.setItem(LEGACY_PREVIEW_KEY, "true");
        set({
          status: "authenticated",
          user: {
            id: "preview-user",
            email: input.email,
            displayName: input.fullName
          }
        });
      },
      signOut: () => {
        sessionStorage.removeItem(LEGACY_PREVIEW_KEY);
        set({ status: "anonymous", user: null });
      }
    }),
    {
      name: "growthos-auth-preview",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ status, user }) => ({ status, user })
    }
  )
);
