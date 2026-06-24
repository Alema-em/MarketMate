# MarketMate — Production Readiness Audit

Audit date: June 2025. Minimal targeted fixes only; no UI redesign.

## Issues Found

### Authentication & sign-out
- Sign-out did not clear client session data (AI chat history, quote cache, search cache), risking cross-user leakage on shared browsers.
- Sign-out did not explicitly redirect to `/login` (relied on `ProtectedRoute` only).
- Login page surfaced raw Firebase error strings.

### Firestore & data isolation
- Client code correctly scopes reads/writes to `users/{uid}/portfolio` and `users/{uid}/watchlist`.
- Firestore security rules are **not** in this repo — isolation depends on Firebase Console rules (manual verification required).
- Firestore snapshot failures showed raw `err.message` and were hidden when portfolio/watchlist appeared empty.

### Demo account
- Demo read-only guards were already in place in hooks; messages preserved.
- Portfolio page was missing edit/delete on holdings for regular users (regression).

### Market data & API resilience
- Quotes API returned HTTP 500 on provider failure instead of fallback quotes.
- Search API returned HTTP 500 with raw provider errors.
- Chart API returned HTTP 500 on failure.
- Client hooks/context surfaced raw fetch and Firestore errors to users.

### AI Copilot
- Default Gemini model was `gemini-2.0-flash` (env override available).
- Non-`GeminiError` failures returned HTTP 500 instead of degraded fallback reply.

### Environment variables
- Verified: only `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL` are referenced from client code.
- `ALPHA_VANTAGE_API_KEY` and `GEMINI_API_KEY` remain server-only.

## Fixes Made

1. **`src/lib/errors/user-messages.ts`** — Central friendly user-facing messages.
2. **`src/lib/session/clear-user-session.ts`** — Clears chat, quote, and search caches on sign-out.
3. **`AuthContext`** — Calls `clearUserSession()` before Firebase sign-out.
4. **`Sidebar`** — Redirects to `/login` after sign-out; closes mobile drawer.
5. **Hooks** (`usePortfolioHoldings`, `useWatchlist`, `useStockSearch`) — Friendly Firestore/search errors; expose `dataError` for empty-state load failures.
6. **`QuotesContext`** — Friendly quote error message.
7. **API routes** (`quotes`, `search`, `chart`, `ai/chat`) — Return fallbacks or friendly payloads instead of raw provider errors; log details server-side only.
8. **`lib/stocks/client.ts`** — Generic client-side error messages.
9. **`login/page.tsx`** — Friendly auth errors.
10. **`InvestmentModal`** — Friendly save errors (demo read-only messages preserved).
11. **`portfolio/page.tsx`** — Restored edit/delete for non-demo users; show Firestore error when empty + load failed.
12. **`watchlist/page.tsx`** — Show Firestore error when empty + load failed.
13. **`gemini.ts`** — Default model `gemini-1.5-flash`.
14. **`quote-cache.ts`** — Exported `clearQuoteCache()`.

## Files Changed

- `src/lib/errors/user-messages.ts` (new)
- `src/lib/session/clear-user-session.ts` (new)
- `src/context/AuthContext.tsx`
- `src/context/QuotesContext.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/portfolio/InvestmentModal.tsx`
- `src/hooks/usePortfolioHoldings.ts`
- `src/hooks/useWatchlist.ts`
- `src/hooks/usePortfolio.ts`
- `src/hooks/useStockSearch.ts`
- `src/lib/stocks/quote-cache.ts`
- `src/lib/stocks/client.ts`
- `src/lib/ai/gemini.ts`
- `src/app/login/page.tsx`
- `src/app/portfolio/page.tsx`
- `src/app/watchlist/page.tsx`
- `src/app/api/stocks/quotes/route.ts`
- `src/app/api/stocks/search/route.ts`
- `src/app/api/stocks/chart/route.ts`
- `src/app/api/ai/chat/route.ts`
- `IMPLEMENTATION_NOTES.md` (this file)

## Remaining Risks & Manual Tests

### Security & auth
- [ ] Confirm Firestore rules deny cross-user reads/writes on `users/{userId}/**`.
- [ ] Sign in as User A → sign out → sign in as User B on same browser; confirm no prior chat/quotes/search cache.
- [ ] Sign out redirects to `/login` on desktop and mobile.

### Regular user flows
- [ ] New user: empty portfolio/watchlist with onboarding CTAs.
- [ ] Add, edit, delete investment on `/portfolio`.
- [ ] Add/remove watchlist symbols.
- [ ] Firestore permission denial shows friendly error (not raw Firebase text).

### Demo account
- [ ] Demo email sees seeded data, banner, no add/edit/delete.
- [ ] Demo insights panel loads on `/insights`.

### Market data
- [ ] With valid `ALPHA_VANTAGE_API_KEY`: live quotes and search work.
- [ ] Rate limit / API down: fallback quotes, `MarketDataBanner` warnings, no raw errors in UI.
- [ ] Refresh button works when throttled.

### AI Copilot
- [ ] Chat works with `GEMINI_API_KEY` set.
- [ ] Missing/invalid key: degraded educational fallback, HTTP 200, user message retained.

### Layout
- [ ] Smoke-test `/dashboard`, `/portfolio`, `/watchlist`, `/copilot` at mobile (~375px) and desktop widths.

### Not addressed (out of scope)
- API routes are unauthenticated (acceptable for MVP; keys stay server-side).
- Investment modal does not require picking a symbol from search results (format validation only).
- No server-side Firebase Admin verification on API routes.

---

## Display Currency Feature (June 2025)

### Summary
User-selectable display currency (USD default; AED, INR, GBP, EUR). Holdings and market prices remain USD internally; conversion is display-only via Frankfurter exchange rates (`/api/fx/rates`).

### Design
- **Preference storage:** `users/{uid}/preferences/app` → `displayCurrency` (does not change portfolio/watchlist schema).
- **Local fallback:** `localStorage` per user + global key before Firestore loads.
- **Demo accounts:** Currency changes apply locally only; no Firestore writes.
- **FX source:** [open.er-api.com](https://open.er-api.com) (primary, includes AED) with [Frankfurter](https://www.frankfurter.app/) fallback. Server cache 1h fresh; stale cache up to 24h; client `localStorage` backup.
- **Unavailable rates:** Falls back to USD formatting with amber warnings in sidebar + `MarketDataBanner` (never pretends live FX).
- **AI context:** Portfolio amounts sent to Gemini in display currency with `baseCurrency`, `exchangeRatesStale`, `exchangeRatesUnavailable` metadata.

### Files added/changed
- `src/types/currency.ts` (new)
- `src/lib/currency/format.ts`, `exchange-rates.ts`, `client-rates-cache.ts`, `preference-storage.ts` (new)
- `src/app/api/fx/rates/route.ts` (new)
- `src/lib/firestore/preferences.ts` (new)
- `src/context/CurrencyContext.tsx` (new)
- `src/components/settings/CurrencySelector.tsx` (new)
- `src/app/layout.tsx` — `CurrencyProvider`
- `src/components/layout/Sidebar.tsx` — selector in footer
- `src/app/dashboard/page.tsx`, `portfolio/page.tsx`, `watchlist/page.tsx`
- `src/components/stocks/StockCard.tsx`, `WatchlistCard.tsx`, `MarketDataBanner.tsx`
- `src/components/charts/PortfolioChart.tsx`
- `src/lib/ai/portfolio-context.ts`, `prompts.ts`, `useAIChat.ts`, `types/ai.ts`, `api/ai/chat/route.ts`

### Manual tests
- [ ] Default USD: all values match pre-feature behavior.
- [ ] Switch to EUR/GBP/INR/AED: dashboard, portfolio, watchlist, chart tooltips update with correct locale symbols.
- [ ] Regular user: preference persists after refresh and re-login (Firestore `preferences/app`).
- [ ] Demo user: currency changes on refresh revert unless only localStorage (no Firestore write).
- [ ] Block `/api/fx/rates` or go offline: amber stale/unavailable messaging; USD fallback when no cached rate.
- [ ] Mobile sidebar: currency selector usable in drawer.
- [ ] AI Copilot: ask "what is my portfolio value?" — reply references display currency.
- [ ] Investment modal still labels avg cost as USD; stored values unchanged.

