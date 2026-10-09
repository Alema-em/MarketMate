"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyAuthError } from "@/lib/errors/user-messages";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const VIEW_W = 640;
const VIEW_H = 168;
const BOOK_VALUE = 1_248_320;
const OPEN_VALUE = 1_229_880;
const SESSION_OPEN = 9 * 60 + 15;
const SESSION_CLOSE = 15 * 60 + 30;

const SESSION_VALUES = [
  1229880, 1231520, 1228420, 1230080, 1232640, 1230860, 1236120, 1234540,
  1239020, 1241860, 1239680, 1244280, 1246040, 1243720, 1248320,
];

type CurvePoint = { x: number; y: number; value: number };

const SERIES_MIN = Math.min(...SESSION_VALUES);
const SERIES_MAX = Math.max(...SESSION_VALUES);

function yFor(value: number) {
  const t = (value - SERIES_MIN) / (SERIES_MAX - SERIES_MIN);
  return 142 - t * (142 - 26);
}

const CURVE: CurvePoint[] = SESSION_VALUES.map((value, index) => ({
  x: (index / (SESSION_VALUES.length - 1)) * VIEW_W,
  y: yFor(value),
  value,
}));

const HOLDINGS = [
  { name: "Reliance", symbol: "RELIANCE.NS", weight: 32, change: 1.24 },
  { name: "TCS", symbol: "TCS.NS", weight: 27, change: 0.41 },
  { name: "HDFC Bank", symbol: "HDFCBANK.NS", weight: 21, change: -0.38 },
];

const TAPE = [
  { name: "NIFTY 50", value: "24,182.40", move: 0.42 },
  { name: "SENSEX", value: "79,540.10", move: 0.31 },
  { name: "NIFTY BANK", value: "51,204.65", move: -0.18 },
  { name: "RELIANCE", value: "2,946.15", move: 1.24 },
  { name: "TCS", value: "4,112.80", move: 0.41 },
  { name: "HDFCBANK", value: "1,684.25", move: -0.38 },
  { name: "INFY", value: "1,842.60", move: 0.67 },
  { name: "ITC", value: "482.30", move: 0.12 },
];

const AXIS = ["09:15", "12:00", "14:00", "15:30"];

function formatMove(value: number) {
  const abs = Math.abs(value).toFixed(2);
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `−${abs}%`;
  return `${abs}%`;
}

function formatSignedInr(value: number) {
  const formatted = inr.format(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`;
  return formatted;
}

function smoothPath(points: CurvePoint[]) {
  if (points.length < 2) return "";
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const LINE_PATH = smoothPath(CURVE);
const FILL_PATH = `${LINE_PATH} L${VIEW_W} ${VIEW_H} L0 ${VIEW_H} Z`;
const DAY_MOVE = ((BOOK_VALUE - OPEN_VALUE) / OPEN_VALUE) * 100;

function sessionClock(index: number) {
  const span = SESSION_CLOSE - SESSION_OPEN;
  const mins =
    SESSION_OPEN + Math.round((index / (CURVE.length - 1)) * span);
  const hour = Math.floor(mins / 60);
  const minute = mins % 60;
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

function getNseSession(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const weekday = read("weekday");
  const hour = Number(read("hour"));
  const minute = Number(read("minute"));
  const minutes = hour * 60 + minute;
  const weekend = weekday === "Sat" || weekday === "Sun";
  const open =
    !weekend && minutes >= SESSION_OPEN && minutes < SESSION_CLOSE;
  return {
    open,
    clock: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} IST`,
  };
}

const sans =
  "[font-family:var(--font-login-sans),ui-sans-serif,system-ui,sans-serif]";
const serif = "[font-family:var(--font-login-serif),Georgia,serif]";
const mono =
  "[font-family:var(--font-login-mono),ui-monospace,monospace] tabular-nums";

export function LoginScreen() {
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

  if (loading || user) {
    return (
      <div
        className={`${sans} flex min-h-screen items-center justify-center bg-[#080b10] text-sm text-muted`}
      >
        <span className="mr-3 h-4 w-4 animate-spin rounded-full border border-white/20 border-t-white" />
        Checking session
      </div>
    );
  }

  return (
    <main
      className={`${sans} min-h-screen bg-[#080b10] text-foreground selection:bg-accent/30 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:grid-rows-[auto_auto_auto_minmax(1.5rem,1fr)_auto]`}
    >
      <header className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-10 lg:col-start-1 lg:row-start-1 lg:px-12 lg:pt-8 xl:px-16">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <TrendingUp className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            MarketMate
          </span>
        </div>
        <SessionStatus />
      </header>

      <div className="px-6 pt-12 sm:px-10 lg:col-start-1 lg:row-start-2 lg:px-12 lg:pt-16 xl:px-16">
        <div className="max-w-[680px]">
          <h1
            className={`${serif} text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.94] tracking-[-0.035em] text-white`}
          >
            Your holdings,
            <br />
            <span className="italic">in plain sight.</span>
          </h1>
          <p className="mt-5 max-w-[38ch] text-base leading-7 text-muted">
            NSE and BSE positions, a watchlist, and profit or loss. One
            session, nothing else in the way.
          </p>
        </div>
      </div>

      <SignInPanel
        firebaseReady={firebaseReady}
        error={error}
        signingIn={signingIn}
        onSignIn={handleGoogleSignIn}
      />

      <div className="px-6 pt-10 sm:px-10 lg:col-start-1 lg:row-start-3 lg:px-12 lg:pt-10 xl:px-16">
        <SampleBook />
      </div>

      <div className="hidden lg:col-start-1 lg:row-start-4 lg:block" />

      <div className="px-6 pb-6 pt-8 sm:px-10 lg:col-start-1 lg:row-start-5 lg:px-12 lg:pb-8 xl:px-16">
        <Tape />
        <p className={`${mono} mt-4 text-[11px] text-muted`}>
          © {new Date().getFullYear()} MarketMate
        </p>
      </div>
    </main>
  );
}

function SessionStatus() {
  const [session, setSession] = useState<ReturnType<typeof getNseSession> | null>(
    null
  );

  useEffect(() => {
    const update = () => setSession(getNseSession());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const open = session?.open ?? false;

  return (
    <p className="flex items-center gap-2 text-xs text-muted">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          session ? (open ? "bg-gain" : "bg-white/25") : "bg-white/15"
        }`}
        aria-hidden
      />
      <span className="font-medium text-foreground/90">NSE</span>
      <span>{session ? (open ? "Open" : "Closed") : "—"}</span>
      <span aria-hidden className="text-white/20">
        /
      </span>
      <span className={`${mono} text-[11px]`}>{session?.clock ?? "--:-- IST"}</span>
    </p>
  );
}

function SampleBook() {
  const gradientId = useId().replace(/:/g, "");
  const lineRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(2000);
  const [phase, setPhase] = useState<"pending" | "draw" | "static">("pending");
  const [active, setActive] = useState<number | null>(null);
  const point = active === null ? null : CURVE[active];
  const last = CURVE[CURVE.length - 1];

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    setPathLength(line.getTotalLength());
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduce ? "static" : "draw");
  }, []);

  const scrub = (clientX: number, bounds: DOMRect) => {
    if (bounds.width === 0) return;
    const x = ((clientX - bounds.left) / bounds.width) * VIEW_W;
    let nearest = 0;
    let best = Infinity;
    CURVE.forEach((item, index) => {
      const distance = Math.abs(item.x - x);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActive(nearest);
  };

  return (
    <section
      className="max-w-[680px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#10151d] shadow-[0_30px_80px_-48px_rgba(0,0,0,0.85)]"
      aria-labelledby="sample-book-title"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3 sm:px-6">
        <h2
          id="sample-book-title"
          className={`${mono} text-[11px] font-medium uppercase tracking-[0.16em] text-muted`}
        >
          Sample book
        </h2>
        <p className={`${mono} text-[11px] text-muted`}>Not a live quote</p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Portfolio value</p>
            <p
              className={`${serif} mt-1 text-[clamp(2.15rem,4vw,3.15rem)] leading-none tracking-[-0.03em] text-white`}
            >
              {inr.format(BOOK_VALUE)}
            </p>
          </div>
          <p className="pb-1 text-right text-sm">
            <span className={`${mono} text-gain`}>{formatMove(DAY_MOVE)}</span>
            <span className="mt-1 block text-xs text-muted">today</span>
          </p>
        </div>
        <p className="mt-3 text-sm text-muted">
          <span className={`${mono} text-gain`}>
            {formatSignedInr(BOOK_VALUE - OPEN_VALUE)}
          </span>{" "}
          since the open
          <span className="text-white/25"> · </span>
          <span className={`${mono} text-[12px] text-muted`}>
            12 positions
          </span>
        </p>

        <div className="relative mt-6">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full cursor-crosshair touch-pan-y"
            role="img"
            aria-label={`Illustrative intraday curve from ${inr.format(OPEN_VALUE)} at the open to ${inr.format(BOOK_VALUE)} at the close.`}
            onPointerMove={(event) =>
              scrub(event.clientX, event.currentTarget.getBoundingClientRect())
            }
            onPointerLeave={() => setActive(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[48, 88, 128].map((y) => (
              <line
                key={y}
                x1="0"
                x2={VIEW_W}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path className="login-chart-fill" d={FILL_PATH} fill={`url(#${gradientId})`} />
            <path
              ref={lineRef}
              className={phase === "draw" ? "login-chart-line" : undefined}
              d={LINE_PATH}
              fill="none"
              stroke="#e7eef8"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={
                {
                  "--login-path": pathLength,
                  strokeDasharray: pathLength,
                  strokeDashoffset: phase === "static" ? 0 : pathLength,
                } as CSSProperties
              }
            />
            {point && (
              <line
                x1={point.x}
                x2={point.x}
                y1="12"
                y2={VIEW_H - 10}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <circle className="login-chart-fill" cx={last.x} cy={last.y} r="3.4" fill="#f8fafc" />
            {point && (
              <circle cx={point.x} cy={point.y} r="4" fill="#f8fafc" />
            )}
          </svg>

          {point && (
            <div
              className="pointer-events-none absolute top-2 z-10 rounded-md border border-white/10 bg-[#0c1017]/95 px-2.5 py-1.5 shadow-lg"
              style={{
                left: `${(point.x / VIEW_W) * 100}%`,
                transform:
                  point.x > VIEW_W * 0.7
                    ? "translateX(calc(-100% - 8px))"
                    : "translateX(8px)",
              }}
            >
              <p className={`${mono} text-[10px] text-muted`}>
                {sessionClock(active ?? 0)} IST
              </p>
              <p className={`${mono} text-[12px] text-white`}>
                {inr.format(point.value)}
              </p>
            </div>
          )}
        </div>

        <div
          className={`${mono} mt-2 flex justify-between text-[10px] text-muted`}
        >
          {AXIS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <p className={`${mono} mt-6 text-[11px] uppercase tracking-[0.16em] text-muted`}>
          Largest three
        </p>
        <ul className="mt-1 divide-y divide-white/[0.06]">
          {HOLDINGS.map((holding) => (
            <li key={holding.symbol} className="py-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-white">{holding.name}</span>
                <span
                  className={`${mono} text-[13px] ${
                    holding.change >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {formatMove(holding.change)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <span className={`${mono} text-[11px] text-muted`}>
                  {holding.symbol}
                </span>
                <span className="relative h-[2px] flex-1 bg-white/[0.08]">
                  <span
                    className="absolute inset-y-0 left-0 bg-white/75"
                    style={{ width: `${holding.weight}%` }}
                  />
                </span>
                <span className={`${mono} w-8 text-right text-[11px] text-muted`}>
                  {holding.weight}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Tape() {
  const items = [...TAPE, ...TAPE];

  return (
    <div className="login-ticker flex items-center gap-4 border-t border-white/[0.06] pt-4">
      <p className="sr-only">
        Illustrative session tape. These are not live market prices.
      </p>
      <span
        className={`${mono} hidden shrink-0 text-[10px] uppercase tracking-[0.16em] text-muted sm:inline`}
      >
        Illustrative
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden" aria-hidden>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#080b10] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#080b10] to-transparent" />
        <div className="login-ticker-track flex w-max items-baseline gap-8 pr-8">
          {items.map((item, index) => (
            <span key={`${item.name}-${index}`} className="flex items-baseline gap-2 text-[12px]">
              <span className="text-foreground/85">{item.name}</span>
              <span className={`${mono} text-[11px] text-muted`}>{item.value}</span>
              <span className={item.move >= 0 ? "text-gain" : "text-loss"}>
                {formatMove(item.move)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignInPanel({
  firebaseReady,
  error,
  signingIn,
  onSignIn,
}: {
  firebaseReady: boolean;
  error: string | null;
  signingIn: boolean;
  onSignIn: () => void;
}) {
  return (
    <section className="flex items-center px-6 py-10 sm:px-10 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:h-full lg:border-l lg:border-white/[0.08] lg:bg-[#0c1017] lg:px-10 lg:py-8">
      <div className="w-full lg:max-w-[320px]">
        <p className={`${mono} text-[11px] uppercase tracking-[0.16em] text-muted`}>
          Account
        </p>
        <h2
          className={`${serif} mt-3 text-[2.6rem] leading-none tracking-[-0.03em] text-white`}
        >
          Sign in
        </h2>
        <p className="mt-4 text-sm leading-6 text-muted">
          Google is the only way in. MarketMate does not keep a separate
          password.
        </p>

        {!firebaseReady && (
          <p className="mt-5 border-l-2 border-amber-300/80 bg-amber-300/[0.06] px-3 py-2.5 text-[13px] leading-5 text-amber-100">
            Firebase is not configured. Add credentials to{" "}
            <code className="text-amber-50">.env.local</code> to enable sign-in.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 border-l-2 border-loss bg-loss-muted px-3 py-2.5 text-[13px] leading-5 text-loss"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onSignIn}
          disabled={!firebaseReady || signingIn}
          aria-busy={signingIn}
          className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white px-4 text-[15px] font-medium text-[#1f1f1f] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-[background-color,transform] duration-150 hover:bg-[#f4f5f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          {signingIn ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/15 border-t-[#1f1f1f]" />
          ) : (
            <GoogleMark />
          )}
          Continue with Google
        </button>

        <p className="mt-4 text-xs leading-5 text-muted">
          Your holdings are stored against this Google account.
        </p>
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
