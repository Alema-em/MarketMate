import type { Metadata } from "next";
import { LoginScreen } from "./login-screen";

export const metadata: Metadata = {
  title: "Sign in — MarketMate",
  description:
    "Sign in with Google to open your NSE and BSE portfolio in MarketMate.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
