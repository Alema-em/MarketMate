"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ChartColumn, Shield, Zap, ChartLine } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { getFriendlyAuthError } from "@/lib/errors/user-messages";

export default function LoginPage() {
  const { user, loading, signInWithGoogle, firebaseReady } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      </div>
    );
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,58%)_minmax(380px,42%)] xl:grid-cols-[minmax(0,56%)_minmax(420px,44%)]">
      <section className="relative hidden min-w-0 overflow-hidden bg-surface lg:flex lg:flex-col lg:px-8 lg:py-8 xl:px-12 xl:py-10">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-emerald-500/10"
          aria-hidden
        />

        <header className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-emerald-500 shadow-xl shadow-accent/30">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">MarketMate</h1>
            <p className="text-sm text-muted">Your portfolio, simplified</p>
          </div>
        </header>

        <div className="relative flex flex-1 items-center py-10">
          <section className="max-w-lg">
            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Invest smarter with clarity
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted xl:text-lg">
              Track holdings, monitor your watchlist, and visualize performance -
              all in one modern dashboard.
            </p>
            <ul className="mt-8 space-y-3.5">
              {[
                { icon: ChartLine, text: "Live prices via Alpha Vantage" },
                { icon: ChartColumn, text: "Real-time P/L on every holding" },
                { icon: Shield, text: "Secure Google authentication" },
                { icon: Zap, text: "Fast, mobile-friendly experience" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-muted">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="relative text-sm text-muted">
          (c) {new Date().getFullYear()} MarketMate - Live market data
        </p>
      </section>

      <section className="flex min-w-0 items-center justify-center px-6 py-8 sm:px-10 lg:px-8 xl:px-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-emerald-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MarketMate</h1>
              <p className="text-xs text-muted">Portfolio Tracker</p>
            </div>
          </div>

          <div className="glass-card p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gain/20 bg-gain-muted px-3 py-1 text-xs font-medium text-gain">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gain" />
              Markets connected
            </div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="mt-2 text-muted">
              Sign in to track holdings, watchlists, and live gains in one place.
            </p>

            {!firebaseReady && (
              <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Firebase is not configured. Add credentials to{" "}
                <code className="text-amber-100">.env.local</code> to enable sign-in.
                You can still explore the UI after configuring Firebase.
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-loss/30 bg-loss-muted px-4 py-3 text-sm text-loss">
                {error}
              </p>
            )}

            <Button
              className="mt-6 w-full"
              size="lg"
              loading={signingIn}
              disabled={!firebaseReady}
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-xs text-muted">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
