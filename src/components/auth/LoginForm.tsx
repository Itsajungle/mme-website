"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { LogIn, Mail, Lock, Info } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, role, brandClient } = useAuth();
  const router = useRouter();

  // Route after login based on role
  useEffect(() => {
    if (isAuthenticated) {
      if (role === "brand-client" && brandClient) {
        router.push(`/portal/${brandClient.brandSlug}`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, role, brandClient, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const err = login(email, password);
    if (err) {
      setError(err);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <span className="font-heading text-base font-bold text-bg">M</span>
          </div>
          <span className="font-heading text-2xl font-bold text-text">MME</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card p-8">
        <h1 className="font-heading text-2xl font-bold text-text mb-2 text-center">
          Client Login
        </h1>
        <p className="text-text-secondary text-sm text-center mb-8">
          Access your station dashboard or brand portal
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-border bg-bg-deep pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-border bg-bg-deep pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-border bg-bg-deep text-accent focus:ring-accent/40 h-4 w-4"
              />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <button type="button" className="text-sm text-accent hover:text-accent-hover transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-bg hover:bg-accent-hover transition-colors"
          >
            <LogIn size={18} />
            Sign In
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-xl border border-border/50 bg-bg-card/50 p-5">
        <div className="flex items-start gap-3">
          <Info className="text-accent mt-0.5 shrink-0" size={16} />
          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">Demo Credentials</p>
            <div className="space-y-1.5 text-xs font-mono">
              <p className="text-text-muted">
                <span className="text-text-secondary">Station:</span>{" "}
                demo@starbroadcasting.com / demo2026
              </p>
              <p className="text-text-muted">
                <span className="text-text-secondary">Brand Portal:</span>{" "}
                tadg@riordanmotors.ie / demo2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
