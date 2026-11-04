import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { CONTACT } from "../../data/portfolio";
import { ArrowRight, CheckIcon, CopyIcon, TubeLink } from "./parts";

const tube = (c: string) => ({ "--tube": c } as React.CSSProperties);

/* ── contact: the last stop of the ride, read on the platform ──────── */

export const ContactPanel = () => {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };
  const exits = [
    { label: t("contact_whatsapp"), href: CONTACT.whatsapp, color: "#05d9e8" },
    { label: t("contact_linkedin"), href: CONTACT.linkedin, color: "#05d9e8" },
    { label: t("contact_github"), href: CONTACT.github, color: "#b9a9d6" },
    { label: t("contact_cv"), href: CONTACT.cv, color: "#f9f002" },
  ];
  return (
    <div data-power className="brackets relative bg-ink/95 p-5 sm:p-7" style={{ boxShadow: "inset 0 1px 0 #f9f002, 0 -14px 44px -26px #f9f002" }}>
      <h2 id="contact-title" className="cond chroma text-[clamp(2.6rem,5vw,4.5rem)] text-white">
        {t("contact_title")}
      </h2>
      <p className="mt-4 max-w-[52ch] leading-relaxed text-[#cfc3e6]">{t("contact_intro")}</p>

      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
        <a href={`mailto:${CONTACT.email}`} className="cond tube break-all text-[clamp(1.6rem,3.2vw,2.6rem)] normal-case no-underline" style={tube("#05d9e8")}>
          {CONTACT.email}
        </a>
        <button type="button" onClick={copy} className="hud hud-btn">
          {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>

      <ul className="mt-7 flex flex-wrap gap-2.5">
        {exits.map((e) => (
          <li key={e.label}>
            <TubeLink href={e.href} color={e.color} external>
              {e.label} <ArrowRight />
            </TubeLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer = () => {
  const { t } = useTranslation("common");
  return (
    <footer className="bg-ink">
      {/* platform edge: the yellow tactile strip */}
      <div aria-hidden="true" className="h-3" style={{ background: "radial-gradient(circle, #f9f002 1.6px, transparent 2.2px) 0 0 / 9px 9px, #3a3405" }} />
      <div aria-hidden="true" className="h-px bg-neon-acid" style={{ boxShadow: "0 0 18px 2px rgba(249,240,2,0.5)" }} />
      <p className="mx-auto max-w-page px-4 py-10 text-sm leading-relaxed text-haze sm:px-8">
        © {new Date().getFullYear()} · {t("footer")}
      </p>
    </footer>
  );
};
