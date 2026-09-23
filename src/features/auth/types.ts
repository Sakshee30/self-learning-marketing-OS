export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

export type AuthSession = {
  user: AuthUser;
  expiresAt?: string;
};

export type AuthStatus = "anonymous" | "authenticated";
