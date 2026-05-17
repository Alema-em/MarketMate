"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, firebaseReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <span className="flex min-h-screen items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      </span>
    );
  }

  if (!user) {
    return null;
  }

  if (!firebaseReady) {
    return (
      <span className="flex min-h-screen items-center justify-center p-6 text-center">
        <span className="glass-card max-w-md p-6">
          <p className="text-sm text-muted">
            Firebase is not configured. Copy <code className="text-accent">.env.example</code> to{" "}
            <code className="text-accent">.env.local</code> and add your project credentials.
          </p>
        </span>
      </span>
    );
  }

  return <>{children}</>;
}
