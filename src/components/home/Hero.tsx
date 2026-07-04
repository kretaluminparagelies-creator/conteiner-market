/**
 * @file Hero.tsx
 * @description Home page hero — title on top, search + GLB container below
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { HeroVisualRow } from "@/components/home/HeroVisualRow";
import { heroTickerDurationSec } from "@/lib/constants/home";
import { useLocale } from "@/lib/i18n/locale-context";
import { heroEnterStyle } from "@/lib/utils/motion";

export function Hero() {
  const { t } = useLocale();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-60px)] flex-col justify-center overflow-hidden px-[7%] pb-8">
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 bg-[linear-gradient(#1a30501e_1px,transparent_1px),linear-gradient(90deg,#1a30501e_1px,transparent_1px)] bg-size-[64px_64px]",
          "transition-opacity duration-[1200ms]",
          ready ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div
        aria-hidden="true"
        className="animate-glow-pulse pointer-events-none absolute top-[20%] left-[10%] h-[700px] w-[700px] bg-[radial-gradient(circle,#e0703018_0%,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="animate-glow-pulse-slow pointer-events-none absolute top-[50%] right-[5%] h-[400px] w-[400px] bg-[radial-gradient(circle,#4080c815_0%,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-b from-transparent via-cm-bg/40 to-cm-light-bg"
      />

      <div className="absolute inset-x-0 top-0 z-10 overflow-hidden border-y border-cm-border bg-cm-bg/80 py-1.5">
        <div
          className="animate-ticker flex whitespace-nowrap"
          style={{ animationDuration: `${heroTickerDurationSec}s` }}
        >
          {[t.hero.ticker, t.hero.ticker].map((text, index) => (
            <span
              key={index}
              className="font-mono text-[10px] tracking-[0.25em] text-cm-muted"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-20 mt-10 flex flex-col gap-8 lg:gap-10">
        <div className="max-w-4xl">
          <p
            className="mb-5 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase"
            style={{
              opacity: ready ? 1 : 0,
              transition: "opacity 0.5s 0.1s",
            }}
          >
            {t.hero.eyebrow}
          </p>

          <h1 className="font-display text-[clamp(1.625rem,3.2vw,2.5rem)] leading-none font-bold">
            <span className="inline-flex flex-nowrap items-baseline gap-x-[0.35em]">
              {t.hero.words.map((word, index) => (
                <span key={word} className="inline-flex shrink-0 items-baseline gap-x-[0.35em]">
                  <span
                    className={index === 2 ? "text-cm-accent" : "text-cm-text"}
                    style={heroEnterStyle(ready, index * 0.15 + 0.2)}
                  >
                    {word}
                  </span>
                  {index < t.hero.words.length - 1 ? (
                    <span aria-hidden="true" className="font-light text-cm-muted">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="mt-4 max-w-2xl text-[clamp(0.9375rem,1.75vw,1.25rem)] font-light text-cm-sub"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(20px)",
              transition: "opacity 0.7s 0.7s, transform 0.7s 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {t.hero.subtitleLine1}
            <br />
            {t.hero.subtitleLine2}
          </p>
        </div>

        <div
          className="w-full min-w-0"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "none" : "translateY(24px) scale(0.98)",
            transition: "opacity 0.9s 0.5s, transform 0.9s 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <HeroVisualRow />
        </div>
      </div>

      <div
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5"
        style={{
          opacity: ready ? 0.55 : 0,
          transition: "opacity 1s 1.5s",
        }}
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-cm-muted">{t.hero.scroll}</span>
        <div className="scroll-line h-9 w-px bg-linear-to-b from-cm-muted to-transparent" />
      </div>
    </section>
  );
}
