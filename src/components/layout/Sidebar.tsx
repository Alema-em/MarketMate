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
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground font-serif text-[15px] text-background">
          M
        </span>
        <h1 className="text-[15px] font-semibold tracking-[-0.01em]">
          MarketMate
        </h1>
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
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted hover:bg-white/[0.03] hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <CurrencySelector />
        {user && (
          <div className="mb-3 flex items-center gap-3 px-2 py-2">
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
          onClick={() => void handleSignOut()}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-loss-muted hover:text-loss"
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
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-border lg:bg-surface lg:px-3 lg:py-5">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface px-3 py-5 transition-transform duration-300 lg:hidden ${
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
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="font-serif text-xl leading-none tracking-[-0.03em]">
        {title}
      </h1>
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
