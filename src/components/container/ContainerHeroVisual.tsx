/**
 * @file ContainerHeroVisual.tsx
 * @description Hero visual switcher — GLB / Code 3D / 2D fallback
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import dynamic from "next/dynamic";
import { Component, useRef, useState, type ReactNode } from "react";
import { ContainerVisual2D } from "@/components/container/ContainerVisual2D";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const USE_PLAN_A_3D = true;
const USE_SKETCHFAB_GLB = true;

const ContainerScene = dynamic(
  () => import("@/components/container/ContainerScene").then((mod) => mod.ContainerScene),
  { ssr: false, loading: () => <ContainerVisual2DFallback /> },
);

const ContainerSceneGLB = dynamic(
  () =>
    import("@/components/container/ContainerSceneGLB").then((mod) => mod.ContainerSceneGLB),
  { ssr: false, loading: () => <ContainerVisual2DFallback /> },
);

function ContainerVisual2DFallback() {
  return (
    <div className="hero-visual-fallback flex h-full min-h-[220px] items-center justify-center lg:min-h-[420px]">
      <div className="hero-float w-full max-w-[420px] px-4">
        <ContainerVisual2D />
      </div>
    </div>
  );
}

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

export type ContainerHeroPlan = "glb" | "code" | "2d";

type ContainerHeroVisualProps = {
  className?: string;
  plan?: ContainerHeroPlan;
};

export function ContainerHeroVisual({ className, plan }: ContainerHeroVisualProps) {
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const usePlanA = plan === "2d" ? false : USE_PLAN_A_3D && isDesktop && !reducedMotion;
  const [doorsOpen, setDoorsOpen] = useState(true);
  const closeTimerRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDoorsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = window.setTimeout(() => setDoorsOpen(false), 800);
  };

  if (!usePlanA || plan === "2d") {
    return <ContainerVisual2DFallback />;
  }

  const useGlb = plan === "glb" || (plan === undefined && USE_SKETCHFAB_GLB);
  const CodeScene = <ContainerScene doorsOpen={doorsOpen} />;
  const GlbScene = (
    <ModelErrorBoundary fallback={CodeScene}>
      <ContainerSceneGLB doorsOpen={doorsOpen} />
    </ModelErrorBoundary>
  );

  return (
    <div
      className={[
        "hero-visual-3d relative overflow-hidden rounded-xl border border-cm-border bg-cm-bg",
        "h-[220px] w-full cursor-pointer lg:h-[420px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      role="img"
      aria-label="3D shipping container model"
      tabIndex={0}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_60%,#e070301a_0%,transparent_65%)]"
      />
      <div className="relative z-10 h-full w-full">{useGlb ? GlbScene : CodeScene}</div>
    </div>
  );
}
