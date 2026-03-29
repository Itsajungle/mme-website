"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
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

const AUTH_STORAGE_KEY = "mme_auth";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

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

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { email: string; role: UserRole; timestamp: number };
      if (Date.now() - parsed.timestamp > SESSION_MAX_AGE_MS) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }
      if (parsed.role === "brand-client") {
        const brandCred = BRAND_CREDENTIALS.find((c) => c.email === parsed.email);
        if (brandCred) {
          setBrandClient(brandCred.user);
          setRole("brand-client");
          setClient(null);
        }
      } else if (parsed.role === "station-operator") {
        const found = getClientByEmail(parsed.email);
        if (found) {
          setClient(found);
          setRole("station-operator");
          setBrandClient(null);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    // Check brand client credentials first
    const brandCred = BRAND_CREDENTIALS.find(
      (c) => c.email === email && c.password === password,
    );
    if (brandCred) {
      setBrandClient(brandCred.user);
      setRole("brand-client");
      setClient(null);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, role: "brand-client", timestamp: Date.now() }));
      return null;
    }

    // Check station operator credentials
    const found = getClientByEmail(email);
    if (!found) return "Invalid email or password";
    if (found.password !== password) return "Invalid email or password";
    setClient(found);
    setRole("station-operator");
    setBrandClient(null);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, role: "station-operator", timestamp: Date.now() }));
    return null;
  }, []);

  const logout = useCallback(() => {
    setClient(null);
    setBrandClient(null);
    setRole(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
