/**

 * @file HomeCTA.tsx

 * @description Call-to-action section on the home page

 * @author Katsoulakis

 * @copyright 2025 Katsoulakis. All rights reserved.

 */



"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SiteButton } from "@/components/ui/site-button";
import {
  ctaBackgroundImage,
  homePhotoImageClass,
  homePhotoOverlayFadeClass,
  homePhotoOverlayPrimaryClass,
} from "@/lib/constants/home";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  buildHomeCarouselUrl,
  navigateToCategoryCarousel,
} from "@/lib/nav/navigate-offers-route";

export function HomeCTA() {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const goToOffersCarousel = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToCategoryCarousel("offers", pathname, router.push);
  };

  return (

    <section className="relative isolate overflow-hidden px-[6%] py-24">

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">

        <Image

          src={ctaBackgroundImage}

          alt=""

          fill

          sizes="100vw"

          className={[homePhotoImageClass, "object-[center_50%]"].join(" ")}

        />

      </div>



      <div

        aria-hidden="true"

        className={["pointer-events-none absolute inset-0 z-[1]", homePhotoOverlayPrimaryClass].join(" ")}

      />

      <div

        aria-hidden="true"

        className={["pointer-events-none absolute inset-0 z-[1]", homePhotoOverlayFadeClass].join(" ")}

      />



      <div className="glass-category relative z-10 mx-auto max-w-2xl rounded-3xl px-8 py-12 text-center md:px-10 md:py-14">

        <div

          aria-hidden="true"

          className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-linear-to-r from-transparent via-cm-accent/70 to-transparent"

        />

        <p className="mx-auto mb-4 block w-fit rounded-full border border-cm-accent/40 bg-white/92 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-cm-accent uppercase shadow-cm-light-sm">

          {t.cta.eyebrow}

        </p>

        <h2 className="mx-auto mb-4 max-w-xl font-display text-[clamp(1.375rem,3vw,2rem)] leading-[1.15] font-bold text-cm-ink drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)]">

          {t.cta.titleLine1}

          <br />

          {t.cta.titleLine2}

        </h2>

        <p className="mx-auto mb-9 max-w-lg text-[15px] font-medium leading-relaxed text-cm-ink/90">

          {t.cta.body}

        </p>

        <div className="flex flex-wrap justify-center gap-3">

          <SiteButton
            href={buildHomeCarouselUrl("offers")}
            onClick={goToOffersCarousel}
            className="px-9 py-3.5 text-sm shadow-cm-accent md:text-base"
          >
            {t.cta.browse}
          </SiteButton>

          <SiteButton

            href="/epikoinonia?intent=inquiry"

            variant="secondary"

            className="border-cm-light-border-strong bg-white px-9 py-3.5 text-sm text-cm-ink shadow-cm-light-xs hover:border-cm-accent/40 md:text-base"

          >

            {t.cta.contact}

          </SiteButton>

        </div>

      </div>

    </section>

  );

}


