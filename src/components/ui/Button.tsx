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
  primary: "bg-[#f4f7fb] text-[#12161d] hover:bg-white",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-border-strong hover:bg-white/5",
  ghost: "text-muted hover:bg-white/5 hover:text-foreground",
  danger: "border border-loss/30 bg-loss-muted text-loss hover:bg-loss/25",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-1.5 text-sm",
  md: "rounded-lg px-4 py-2.5 text-sm",
  lg: "rounded-lg px-5 py-3 text-[15px]",
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
        className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/15 border-t-current" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
