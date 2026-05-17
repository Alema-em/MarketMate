"use client";

import { type ReactNode } from "react";
import {
  MobileHeader,
  Sidebar,
  useMobileNav,
} from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { useDemoAccount } from "@/hooks/useDemoAccount";

interface AppShellProps {
  children: ReactNode;
  title: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const { mobileOpen, openMobile, closeMobile } = useMobileNav();
  const { isDemo } = useDemoAccount();

  return (
    <ProtectedRoute>
      <span className="flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />
        <span className="flex flex-1 flex-col min-w-0">
          <MobileHeader onMenuClick={openMobile} title={title} />
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
            <header className="mb-6 hidden lg:block">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </header>
            {isDemo && (
              <span className="mb-6 block">
                <DemoModeBanner />
              </span>
            )}
            {children}
          </main>
        </span>
      </span>
    </ProtectedRoute>
  );
}
