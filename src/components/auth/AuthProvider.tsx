"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getClientByEmail, type Client } from "@/lib/clients";

export type UserRole = "station-operator" | "brand-client";

export interface BrandClientUser {
  brandSlug: string;
  stationSlug: string;
  brandName: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  client: Client | null;
  brandClient: BrandClientUser | null;
  role: UserRole | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const BRAND_CREDENTIALS: {
  email: string;
  password: string;
  user: BrandClientUser;
}[] = [
  {
    email: "tadg@riordanmotors.ie",
    password: "demo2026",
    user: {
      brandSlug: "tadg-riordan-motors",
      stationSlug: "sunshine-radio",
      brandName: "Tadg Riordan Motors",
      email: "tadg@riordanmotors.ie",
      name: "Tadg Riordan",
    },
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [brandClient, setBrandClient] = useState<BrandClientUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const login = useCallback((email: string, password: string): string | null => {
    // Check brand client credentials first
    const brandCred = BRAND_CREDENTIALS.find(
      (c) => c.email === email && c.password === password,
    );
    if (brandCred) {
      setBrandClient(brandCred.user);
      setRole("brand-client");
      setClient(null);
      return null;
    }

    // Check station operator credentials
    const found = getClientByEmail(email);
    if (!found) return "Invalid email or password";
    if (found.password !== password) return "Invalid email or password";
    setClient(found);
    setRole("station-operator");
    setBrandClient(null);
    return null;
  }, []);

  const logout = useCallback(() => {
    setClient(null);
    setBrandClient(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        client,
        brandClient,
        role,
        login,
        logout,
        isAuthenticated: !!client || !!brandClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
