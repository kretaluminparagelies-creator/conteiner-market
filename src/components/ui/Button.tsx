/**
 * @file Button.tsx
 * @description Reusable button component with brand variants
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

type ButtonAsLink = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cm-accent text-white hover:bg-[#f08848] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-cm-border bg-transparent text-cm-sub hover:border-cm-accent hover:text-cm-text hover:-translate-y-0.5 active:translate-y-0",
};

function getClassName(variant: ButtonVariant, className?: string): string {
  return [
    "inline-flex items-center justify-center rounded-[3px] px-8 py-3.5",
    "font-display text-[15px] font-semibold transition-all duration-200",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className } = props;
  const classes = getClassName(variant, className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;

  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
