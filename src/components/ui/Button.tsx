"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#f4f0e6] text-[#1c1915] hover:bg-white",
  secondary:
    "border border-white/10 bg-surface text-foreground hover:border-white/20 hover:bg-surface-elevated",
  ghost: "text-muted hover:bg-white/5 hover:text-foreground",
  danger: "border border-loss/30 bg-loss/15 text-loss hover:bg-loss/25",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-1.5 text-sm",
  md: "rounded-md px-4 py-2.5 text-sm",
  lg: "rounded-md px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading && (
          <span
            className={`h-4 w-4 animate-spin rounded-full border-2 ${
              variant === "primary"
                ? "border-[#1c1915]/25 border-t-[#1c1915]"
                : "border-current/30 border-t-current"
            }`}
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
