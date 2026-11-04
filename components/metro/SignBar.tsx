import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { saveLanguagePreference } from "../../utils/useLanguageDetection";

const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
  { code: "ko", label: "한", name: "한국어" },
];

export const SignBar = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const links = [
    { href: "#work", label: t("nav_work") },
    { href: "#route", label: t("nav_route") },
    { href: "#experience", label: t("nav_experience") },
    { href: "#contact", label: t("nav_contact") },
  ];

  return (
    <header className="on-sign sticky top-0 z-40 bg-sign text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-paper focus:px-3 focus:py-1.5 focus:text-ink">
        {t("skip")}
      </a>
      <div className="mx-auto flex h-16 max-w-page items-center gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3 rounded-full no-underline">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-line2 bg-paper text-xs font-extrabold text-ink wide">
            JG
          </span>
          <span className="hidden text-[0.95rem] font-semibold wide sm:inline">Jorge Ignacio Garay</span>
        </a>

        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-[0.9375rem] font-medium text-sign-text no-underline transition-colors hover:bg-sign-line hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div role="group" aria-label={t("language")} className="ml-auto flex rounded-full bg-sign-deep p-1 md:ml-0">
          {LANGS.map((l) => {
            const active = router.locale === l.code;
            return (
              <Link key={l.code} href={router.asPath} locale={l.code} scroll={false}>
                <a
                  lang={l.code}
                  hrefLang={l.code}
                  aria-current={active ? "true" : undefined}
                  aria-label={l.name}
                  onClick={() => saveLanguagePreference(l.code)}
                  className={`min-w-[2.5rem] rounded-full px-2.5 py-1 text-center text-sm font-semibold no-underline transition-colors ${
                    active ? "bg-paper text-ink" : "text-sign-text hover:text-white"
                  }`}
                >
                  {l.label}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      {/* the line stripe under the sign band */}
      <div aria-hidden="true" className="flex h-1.5">
        <div className="flex-[3] bg-line2" />
        <div className="flex-[2] bg-line3" />
        <div className="flex-1 bg-line5" />
      </div>
    </header>
  );
};
