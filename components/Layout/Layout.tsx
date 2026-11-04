import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NavBar } from "../neon/NavBar";

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
}

const SITE = "https://jorgeignaciogaray.netlify.app";

const Layout = ({ children, title, description }: Props) => {
  const { locale, defaultLocale } = useRouter();
  const path = locale && locale !== defaultLocale ? `/${locale}` : "";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#05010f" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="canonical" href={`${SITE}${path}`} />
        {["en", "es", "ko"].map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${SITE}${l === "en" ? "" : `/${l}`}`} />
        ))}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE}${path}`} />
        <meta property="og:image" content={`${SITE}/work/jorge.webp`} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <NavBar />
      <main id="main">{children}</main>
    </>
  );
};

export default Layout;
