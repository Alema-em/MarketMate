import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { QuotesProvider } from "@/context/QuotesContext";
import { PortfolioModalProvider } from "@/context/PortfolioModalContext";
import { InvestmentModal } from "@/components/portfolio/InvestmentModal";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarketMate — Stock Portfolio Tracker",
  description:
    "Track your investments, watchlist, and portfolio performance with MarketMate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <CurrencyProvider>
            <QuotesProvider>
              <PortfolioModalProvider>
                {children}
                <InvestmentModal />
              </PortfolioModalProvider>
            </QuotesProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
