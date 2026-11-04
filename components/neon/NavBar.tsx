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

export const NavBar = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const links = [
    { href: "#work", label: t("nav_work") },
    { href: "#experience", label: t("nav_experience") },
    { href: "#stack", label: t("nav_stack") },
    { href: "#contact", label: t("nav_contact") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-wire bg-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-neon-cyan focus:px-3 focus:py-1.5 focus:text-ink">
        {t("skip")}
      </a>
      <div className="mx-auto flex h-14 items-center gap-6 px-4 sm:px-[2.5vw]">
        <a href="#top" className="flex items-center gap-3 no-underline" aria-label="Jorge Ignacio Garay">
          <span className="cond chroma-sm text-[1.7rem] text-white">JG</span>
          <span className="hud hidden text-[#d8ccef] sm:inline">Jorge Ignacio Garay</span>
        </a>
        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hud block px-3 py-2 text-[0.75rem] text-[#d8ccef] no-underline transition-colors hover:text-neon-cyan">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div role="group" aria-label={t("language")} className="ml-auto flex md:ml-0">
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
                  className={`hud flex h-9 min-w-[2.5rem] items-center justify-center px-2 text-[0.75rem] no-underline transition-colors ${
                    active ? "text-neon-pink" : "text-haze hover:text-white"
                  }`}
                  style={active ? { textShadow: "0 0 8px #ff2a6d", boxShadow: "inset 0 -2px 0 #ff2a6d" } : undefined}
                >
                  {l.label}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
