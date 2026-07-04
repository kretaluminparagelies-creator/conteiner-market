/**
 * @file Hero.tsx
 * @description Home page hero — photo background, title + search
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HeroVisualRow } from "@/components/home/HeroVisualRow";
import { heroBackgroundImage, heroTickerDurationSec } from "@/lib/constants/home";
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
    <section className="relative isolate flex min-h-[calc(100vh-60px)] flex-col justify-center overflow-hidden px-[7%] pb-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center] lg:object-[65%_center]"
        />
      </div>

      {/* Scrim μόνο αριστερά — δεξιά η φωτό καθαρή */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full max-w-[min(100%,720px)] bg-linear-to-r from-white/58 via-white/26 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-linear-to-t from-cm-light-bg/65 via-cm-light-bg/12 to-transparent md:h-24"
      />

      <div className="absolute inset-x-0 top-0 z-20 overflow-hidden border-b border-cm-light-border-strong bg-white/96 py-2 shadow-cm-light-sm backdrop-blur-lg">
        <div
          className="animate-ticker flex whitespace-nowrap"
          style={{ animationDuration: `${heroTickerDurationSec}s` }}
        >
          {[t.hero.ticker, t.hero.ticker].map((text, index) => (
            <span
              key={index}
              className="font-mono text-[11px] font-semibold tracking-[0.22em] text-cm-ink"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-10 flex flex-col gap-8 lg:gap-10">
        <div className="max-w-4xl">
          <p
            className="mb-5 inline-flex w-fit items-center rounded-full border border-cm-accent/40 bg-white/92 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-accent uppercase shadow-cm-light-sm"
            style={{
              opacity: ready ? 1 : 0,
              transition: "opacity 0.5s 0.1s",
            }}
          >
            {t.hero.eyebrow}
          </p>

          <h1 className="font-display text-[clamp(1.625rem,3.2vw,2.5rem)] leading-none font-extrabold [text-shadow:0_1px_0_#fff,0_2px_14px_rgba(255,255,255,0.98),0_0_1px_rgba(23,37,56,0.2)]">
            <span className="inline-flex flex-nowrap items-baseline gap-x-[0.35em]">
              {t.hero.words.map((word, index) => (
                <span key={word} className="inline-flex shrink-0 items-baseline gap-x-[0.35em]">
                  <span
                    className={index === 2 ? "text-cm-accent" : "text-cm-ink"}
                    style={heroEnterStyle(ready, index * 0.15 + 0.2)}
                  >
                    {word}
                  </span>
                  {index < t.hero.words.length - 1 ? (
                    <span aria-hidden="true" className="font-light text-cm-ink/45">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="mt-4 max-w-2xl text-[clamp(1rem,1.9vw,1.3125rem)] font-semibold leading-snug text-cm-ink [text-shadow:0_1px_0_#fff,0_2px_14px_rgba(255,255,255,0.98)]"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(20px)",
              transition: "opacity 0.7s 0.7s, transform 0.7s 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {t.hero.subtitleLine1}
            <br />
            <span className="font-bold text-cm-ink">{t.hero.subtitleLine2}</span>
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
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
        style={{
          opacity: ready ? 0.55 : 0,
          transition: "opacity 1s 1.5s",
        }}
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-cm-ink-muted drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
          {t.hero.scroll}
        </span>
        <div className="scroll-line h-9 w-px bg-linear-to-b from-cm-ink-muted/50 to-transparent" />
      </div>
    </section>
  );
}
