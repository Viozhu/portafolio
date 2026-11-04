import * as React from "react";
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "../components/Layout/Layout";
import { Street } from "../components/neon/Street";
import { Footer } from "../components/neon/Sections";
import { usePowerOn } from "../components/neon/power";

const IndexPage: NextPage = () => {
  const { t } = useTranslation("common");
  usePowerOn();
  return (
    <Layout title={t("meta_title")} description={t("meta_description")}>
      <Street />
      <Footer />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || "en", ["common"])),
  },
});

export default IndexPage;
