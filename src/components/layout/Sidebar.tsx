"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Star,
  TrendingUp,
  Sparkles,
  Bot,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/copilot", label: "AI Copilot", icon: Bot },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/insights", label: "AI Insights", icon: Sparkles },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-2 py-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-emerald-500 shadow-lg shadow-accent/30">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">MarketMate</h1>
          <p className="text-xs text-muted">Portfolio Tracker</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        {user && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-elevated/50 px-3 py-2.5">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt=""
                className="h-9 w-9 rounded-full ring-2 ring-border"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                {user.displayName?.[0] ?? "U"}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.displayName ?? "User"}
              </p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-loss-muted hover:text-loss"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-surface/40 lg:backdrop-blur-xl lg:p-6">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface p-6 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onMobileClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted hover:bg-white/5 hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        <NavContent />
      </aside>
    </>
  );
}

export function MobileHeader({
  onMenuClick,
  title,
}: {
  onMenuClick: () => void;
  title: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}

export function useMobileNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return {
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  };
}
