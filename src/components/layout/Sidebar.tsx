"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Star,
  Sparkles,
  Bot,
  GraduationCap,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { useAuth } from "@/context/AuthContext";
import { CurrencySelector } from "@/components/settings/CurrencySelector";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: GraduationCap },
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
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    onMobileClose?.();
    await signOut();
    router.replace("/login");
  };

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-2 py-1">
        <Mark />
        <div>
          <h1 className="text-[15px] font-medium tracking-tight">MarketMate</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Portfolio
          </p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted hover:bg-white/[0.04] hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <CurrencySelector />
        {user && (
          <div className="mb-3 flex items-center gap-3 border border-white/10 px-3 py-2.5">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt=""
                className="h-9 w-9 rounded-full ring-2 ring-border"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center border border-white/15 text-sm font-medium">
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
          onClick={() => void handleSignOut()}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted transition-colors hover:bg-loss-muted hover:text-loss"
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
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-white/10 lg:bg-background lg:px-4 lg:py-6">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-background p-6 transition-transform duration-300 lg:hidden ${
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
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-background px-4 py-3 lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="font-serif text-2xl font-normal tracking-tight">{title}</h1>
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
