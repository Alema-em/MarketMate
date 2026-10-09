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
          <main className="scrollbar-thin flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <header className="mb-8 hidden lg:block">
              <h1 className="font-serif text-[2rem] leading-none tracking-[-0.03em]">
                {title}
              </h1>
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
