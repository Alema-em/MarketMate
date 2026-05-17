"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { PortfolioHolding } from "@/types/stocks";

interface PortfolioModalContextValue {
  isOpen: boolean;
  editing: PortfolioHolding | null;
  openAdd: () => void;
  openEdit: (holding: PortfolioHolding) => void;
  close: () => void;
}

const PortfolioModalContext = createContext<PortfolioModalContextValue | null>(
  null
);

export function PortfolioModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioHolding | null>(null);

  const openAdd = useCallback(() => {
    setEditing(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((holding: PortfolioHolding) => {
    setEditing(holding);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
  }, []);

  return (
    <PortfolioModalContext.Provider
      value={{ isOpen, editing, openAdd, openEdit, close }}
    >
      {children}
    </PortfolioModalContext.Provider>
  );
}

export function usePortfolioModal() {
  const ctx = useContext(PortfolioModalContext);
  if (!ctx) {
    throw new Error("usePortfolioModal must be used within PortfolioModalProvider");
  }
  return ctx;
}
