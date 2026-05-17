"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StockSearch } from "@/components/stocks/StockSearch";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioModal } from "@/context/PortfolioModalContext";
import {
  hasFormErrors,
  validateHoldingInput,
  type HoldingFormErrors,
} from "@/lib/validation/holding";
import type { PortfolioHoldingInput } from "@/types/stocks";

const emptyForm: PortfolioHoldingInput = {
  symbol: "",
  shares: 0,
  avgCost: 0,
  purchaseDate: new Date().toISOString().slice(0, 10),
  name: "",
};

export function InvestmentModal() {
  const { isOpen, editing, close } = usePortfolioModal();
  const { addHolding, editHolding, saving } = usePortfolio();
  const [form, setForm] = useState<PortfolioHoldingInput>(emptyForm);
  const [errors, setErrors] = useState<HoldingFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setForm({
        symbol: editing.symbol,
        name: editing.name,
        shares: editing.shares,
        avgCost: editing.avgCost,
        purchaseDate: editing.purchaseDate,
      });
    } else {
      setForm({
        ...emptyForm,
        purchaseDate: new Date().toISOString().slice(0, 10),
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [isOpen, editing]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHoldingInput(form);
    setErrors(validation);
    if (hasFormErrors(validation)) return;

    try {
      if (editing) {
        await editHolding(editing.id, form);
      } else {
        await addHolding(form);
      }
      close();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save investment"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="investment-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-surface shadow-2xl scrollbar-thin">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-6 py-4 backdrop-blur-xl">
          <span>
            <h2 id="investment-modal-title" className="text-lg font-semibold">
              {editing ? "Edit investment" : "Add investment"}
            </h2>
            <p className="text-sm text-muted">
              {editing
                ? "Update your position details"
                : "Track a new position in your portfolio"}
            </p>
          </span>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {submitError && (
            <p className="rounded-xl border border-loss/30 bg-loss-muted px-4 py-3 text-sm text-loss">
              {submitError}
            </p>
          )}

          <label className="block">
            <span className="text-sm font-medium text-muted">Ticker symbol</span>
            {editing ? (
              <input
                value={form.symbol}
                readOnly
                className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm text-muted"
              />
            ) : (
              <span className="mt-1.5 block">
                <StockSearch
                  placeholder="Search symbol (e.g. AAPL)…"
                  onSelect={(r) =>
                    setForm((f) => ({
                      ...f,
                      symbol: r.symbol,
                      name: r.name,
                    }))
                  }
                />
                {form.symbol && (
                  <span className="mt-2 inline-flex rounded-lg bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                    {form.symbol}
                    {form.name && form.name !== form.symbol && (
                      <span className="ml-2 font-normal text-muted">
                        · {form.name}
                      </span>
                    )}
                  </span>
                )}
              </span>
            )}
            {errors.symbol && (
              <span className="mt-1 block text-xs text-loss">{errors.symbol}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">
              Quantity purchased
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={form.shares || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  shares: parseFloat(e.target.value) || 0,
                }))
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="e.g. 10"
            />
            {errors.shares && (
              <span className="mt-1 block text-xs text-loss">{errors.shares}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">
              Average buy price (USD)
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.avgCost || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  avgCost: parseFloat(e.target.value) || 0,
                }))
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="e.g. 178.50"
            />
            {errors.avgCost && (
              <span className="mt-1 block text-xs text-loss">{errors.avgCost}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">Purchase date</span>
            <input
              type="date"
              value={form.purchaseDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) =>
                setForm((f) => ({ ...f, purchaseDate: e.target.value }))
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            {errors.purchaseDate && (
              <span className="mt-1 block text-xs text-loss">
                {errors.purchaseDate}
              </span>
            )}
          </label>

          <footer className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={close}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              {editing ? "Save changes" : "Add to portfolio"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
