import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { QuotesProvider } from "@/context/QuotesContext";
import { PortfolioModalProvider } from "@/context/PortfolioModalContext";
import { InvestmentModal } from "@/components/portfolio/InvestmentModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
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
      className={`dark ${inter.variable} ${display.variable} ${mono.variable}`}
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
