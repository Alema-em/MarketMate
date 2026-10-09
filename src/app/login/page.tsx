"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mark } from "@/components/brand/Mark";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyAuthError } from "@/lib/errors/user-messages";

/** Illustrative only. Value = shares × last. Day dollars reconcile to +0.43%. */
const POSITIONS = [
  { symbol: "AAPL", name: "Apple", shares: "24", last: "227.40", day: "+0.82%", up: true, value: "5,457.60" },
  { symbol: "MSFT", name: "Microsoft", shares: "10", last: "418.55", day: "−0.31%", up: false, value: "4,185.50" },
  { symbol: "NVDA", name: "NVIDIA", shares: "15", last: "131.20", day: "+1.94%", up: true, value: "1,968.00" },
  { symbol: "SPY", name: "S&P 500", shares: "18", last: "562.15", day: "+0.22%", up: true, value: "10,118.70" },
] as const;

type NySession = { time: string; state: "Open" | "Closed" };

function readNySession(now: Date): NySession {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value])
  );

  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(parts.weekday);
  const open = weekday && minutes >= 9 * 60 + 30 && minutes < 16 * 60;

  return {
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    state: open ? "Open" : "Closed",
  };
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle, firebaseReady } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [session, setSession] = useState<NySession | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const update = () => setSession(readNySession(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

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

  const busy = loading || signingIn;

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <Mark />
            <span className="text-[15px] font-medium tracking-tight">MarketMate</span>
          </div>
          <div className="text-right font-mono">
            <p className="text-[13px] tabular-nums tracking-tight">
              {session ? session.time : "––:––:––"}
              <span className="ml-1.5 text-muted">ET</span>
            </p>
            <p className="text-[11px] text-muted">
              New York ·{" "}
              <span className={session?.state === "Open" ? "text-gain" : "text-foreground/80"}>
                {session ? session.state : "—"}
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:pt-12 sm:pb-10">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-x-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Portfolio tracker
            </p>
            <h1 className="mt-3 font-serif text-[clamp(1.9rem,5vw,4.25rem)] leading-[0.96] tracking-[-0.02em]">
              What you own,
              <br />
              <span className="italic">and what it did today.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted sm:text-base">
              Holdings, a watchlist, and live P/L — in the currency you use.
            </p>
          </div>

          <div className="lg:pb-1">
            <h2 className="text-lg font-medium tracking-tight">Sign in</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              A Google account is enough.
            </p>

            {!firebaseReady && (
              <p className="mt-4 border-l-2 border-amber-400/80 pl-3 text-sm leading-relaxed text-amber-100">
                Firebase is not configured. Add credentials to{" "}
                <code className="text-amber-50">.env.local</code> to enable sign-in.
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 border-l-2 border-loss pl-3 text-sm leading-relaxed text-loss"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!firebaseReady || busy}
              className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#f4f0e6] text-[15px] font-medium text-[#1c1915] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4f0e6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1c1915]/25 border-t-[#1c1915]" />
              ) : (
                <GoogleMark />
              )}
              {loading ? "Checking session" : signingIn ? "Opening Google" : "Continue with Google"}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Your book stays on your account.
            </p>
          </div>
        </div>

        <figure className="mt-10 border border-[#f4f0e6]/15 bg-[#f4f0e6] text-[#1c1915] sm:mt-12">
          <div className="flex flex-col gap-4 px-4 pt-4 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:pt-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5c564c]">
                Illustrative book
              </p>
              <p className="mt-1 text-sm text-[#5c564c]">Sample prices, not your account</p>
            </div>
            <div className="sm:text-right">
              <p className="font-serif text-[1.75rem] leading-none tracking-tight sm:text-4xl">
                $21,729.80
              </p>
              <p className="mt-1.5 font-mono text-xs tabular-nums text-[#0f7a32]">
                +92.22 · +0.43%
              </p>
            </div>
          </div>

          <SessionLine />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Illustrative portfolio of four positions with sample prices
              </caption>
              <thead>
                <tr className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5c564c]">
                  <th scope="col" className="px-4 py-2 font-medium sm:px-5">
                    Symbol
                  </th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                    Shares
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Last
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Day
                  </th>
                  <th scope="col" className="hidden px-4 py-2 text-right font-medium md:table-cell sm:px-5">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {POSITIONS.map((position) => (
                  <tr key={position.symbol} className="border-t border-[#1c1915]/10">
                    <th scope="row" className="px-4 py-3 text-left font-medium sm:px-5">
                      {position.symbol}
                      <span className="ml-2 hidden font-normal text-[#5c564c] sm:inline">
                        {position.name}
                      </span>
                    </th>
                    <td className="hidden px-3 py-3 text-right font-mono tabular-nums text-[#5c564c] sm:table-cell">
                      {position.shares}
                    </td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">
                      {position.last}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-mono tabular-nums ${
                        position.up ? "text-[#0f7a32]" : "text-[#b42318]"
                      }`}
                    >
                      {position.day}
                    </td>
                    <td className="hidden px-4 py-3 text-right font-mono tabular-nums md:table-cell sm:px-5">
                      {position.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className="border-t border-[#1c1915]/10 px-4 py-3 text-xs text-[#5c564c] sm:px-5">
            Sign in to replace this sample with your book.
          </figcaption>
        </figure>
      </div>
    </main>
  );
}

function SessionLine() {
  return (
    <svg
      viewBox="0 0 800 88"
      className="mt-4 h-20 w-full sm:h-28"
      role="img"
      aria-label="Sample session, closing above the open"
    >
      <line
        x1="0"
        y1="62"
        x2="800"
        y2="62"
        stroke="#1c1915"
        strokeOpacity="0.18"
        strokeDasharray="2 5"
      />
      <path
        d="M0 62 L52 58 L98 66 L150 54 L198 57 L252 44 L304 48 L360 36 L412 41 L470 28 L528 32 L584 20 L640 24 L700 16 L748 18 L792 12 L792 88 L0 88 Z"
        fill="#1c1915"
        fillOpacity="0.05"
      />
      <path
        className="login-spark"
        pathLength={1}
        d="M0 62 L52 58 L98 66 L150 54 L198 57 L252 44 L304 48 L360 36 L412 41 L470 28 L528 32 L584 20 L640 24 L700 16 L748 18 L792 12"
        fill="none"
        stroke="#1c1915"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="792" cy="12" r="2.75" fill="#0f7a32" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
