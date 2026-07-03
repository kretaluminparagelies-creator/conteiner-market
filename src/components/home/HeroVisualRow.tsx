/**
 * @file HeroVisualRow.tsx
 * @description Hero visuals — Spline menu (left) + GLB container (right), separate
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { Component, type ReactNode } from "react";
import { ContainerHeroVisual } from "@/components/container/ContainerHeroVisual";
import { SplineMenuQuickLinks } from "@/components/spline/SplineMenuQuickLinks";
import { SplineServiceMenu } from "@/components/spline/SplineServiceMenu";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function HeroVisualRow() {
  const isDesktop = useIsDesktop(768);

  if (!isDesktop) {
    return (
      <div id="hero-visual" className="flex flex-col gap-4">
        <SplineErrorBoundary fallback={<SplineMenuQuickLinks className="mt-0" />}>
          <SplineServiceMenu variant="hero" />
        </SplineErrorBoundary>
        <ContainerHeroVisual plan="glb" />
        <SplineMenuQuickLinks className="mt-0" />
      </div>
    );
  }

  return (
    <div
      id="hero-visual"
      className="grid h-[min(420px,46vh)] min-h-[320px] w-full min-w-0 grid-cols-2 items-stretch gap-4 lg:h-[420px] lg:min-h-[420px] lg:gap-5"
    >
      <SplineErrorBoundary fallback={<SplineMenuQuickLinks className="self-center" />}>
        <SplineServiceMenu variant="hero" className="h-full min-w-0" />
      </SplineErrorBoundary>
      <ContainerHeroVisual plan="glb" className="h-full min-w-0" />
    </div>
  );
}
