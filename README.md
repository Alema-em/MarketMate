# MarketMate

A modern full-stack stock portfolio web app built with Next.js, Tailwind CSS, Firebase Authentication, and Firestore.

## Features

- Google sign-in via Firebase Authentication
- Dashboard with portfolio summary and charts
- Portfolio tracking with profit/loss calculations
- Watchlist management UI
- Glassmorphism dark fintech design
- Responsive sidebar navigation (mobile drawer)
- **Gemini AI Copilot** — educational investing chat on dashboard & `/copilot`
- AI insights placeholder section
- Firestore-ready hooks for user portfolio data

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) (Auth + Firestore)
- [Recharts](https://recharts.org/) for portfolio charts
- [Lucide React](https://lucide.dev/) icons

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** → **Google** sign-in provider.
3. Create a **Firestore** database.
4. Copy `.env.example` to `.env.local` and fill in your Firebase web app config:

```bash
cp .env.example .env.local
```

### 3. Firestore security rules (starter)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── dashboard/      # Main dashboard
│   ├── portfolio/      # Holdings & P/L
│   ├── watchlist/      # Watchlist page
│   ├── insights/       # AI insights placeholder
│   └── login/          # Google sign-in
├── components/
│   ├── auth/           # Protected route
│   ├── charts/         # Portfolio chart
│   ├── insights/       # AI placeholder
│   ├── layout/         # Sidebar, app shell
│   ├── stocks/         # Stock & watchlist cards
│   └── ui/             # Button, stat cards
├── context/            # Auth provider
├── hooks/              # Portfolio, watchlist, live quotes, search
├── lib/stocks/         # Alpha Vantage, cache, fallback data
├── app/api/stocks/     # Secure server API routes
├── lib/                # Firebase, finance utils
└── types/              # TypeScript interfaces
```

### 5. Gemini (AI investing assistant)

1. Get an API key at [Google AI Studio](https://aistudio.google.com/apikey).
2. Add to `.env.local` (server-only):

```
GEMINI_API_KEY=your_key_here
```

The assistant explains investing concepts, analyzes diversification from your portfolio context, and avoids buy/sell advice. Chat history persists in the browser for the session.

### 6. Alpha Vantage (live stock data)

1. Get a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key).
2. Add to `.env.local` (server-only — **do not** use `NEXT_PUBLIC_`):

```
ALPHA_VANTAGE_API_KEY=your_key_here
```

Live quotes are fetched through Next.js API routes with in-memory caching (5 min quotes, 30 min search) to stay within free-tier limits. If the limit is hit, realistic fallback prices are shown with a banner.

## Demo / presentation account

Set one or more emails in `.env.local` (comma-separated):

```
NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL=demo@marketmate.app,you@gmail.com
```

When a signed-in user’s email matches, MarketMate loads a **read-only curated portfolio** (US stocks, ETFs, crypto exposure), watchlist, AI insights preview, and demo chart — ideal for screenshots and demos. All other users start with an **empty portfolio** and full CRUD in Firestore.

Demo seed data lives in `src/lib/demo/seed-data.ts`.

## Personal accounts

New users see empty onboarding states until they add investments. Holdings and watchlists persist per user in Firestore with live Alpha Vantage prices.

## Scripts

| Command        | Description          |
|----------------|----------------------|
| `npm run dev`  | Start dev server     |
| `npm run build`| Production build     |
| `npm run start`| Start production     |
| `npm run lint` | Run ESLint           |

## License

MIT
