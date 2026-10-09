import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { LoginScreen } from "./login-screen";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-login-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-login-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-login-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sign in — MarketMate",
  description:
    "Sign in with Google to open your NSE and BSE portfolio in MarketMate.",
};

export default function LoginPage() {
  return (
    <div
      className={`${serif.variable} ${sans.variable} ${mono.variable} min-h-screen bg-[#080b10]`}
    >
      <LoginScreen />
    </div>
  );
}
