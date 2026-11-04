import * as React from "react";
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "../components/Layout/Layout";
import { Hero } from "../components/metro/Hero";
import { Experience, RouteMap, Terminus, Transfers } from "../components/metro/Sections";

const IndexPage: NextPage = () => {
  const { t } = useTranslation("common");
  return (
    <Layout title={t("meta_title")} description={t("meta_description")}>
      <Hero />
      <RouteMap />
      <Experience />
      <Transfers />
      <Terminus />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || "en", ["common"])),
  },
});

export default IndexPage;
