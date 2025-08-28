import type { User } from "../../users/entities/user.entity";

export interface TokenPayload {
  sub: string;
  email: string;
  type: "access" | "refresh";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type UserWithoutPassword = Omit<User, "password">;

export interface AuthResponse {
  user: UserWithoutPassword;
  tokens: TokenPair;
}

export interface CurrentUser {
  id: string;
  email: string;
  name?: string;
}
