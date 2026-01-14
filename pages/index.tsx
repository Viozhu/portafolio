import * as React from "react";
import Layout from "../components/Layout/Layout";
import { NextPage } from "next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Hero from "../components/Hero/Hero";
import ProjectCard from "../components/Projects/ProjectCard";
import { Contact } from "../components/Contact/contact";
import { Skills } from "../components/Skills/Skills";
import { About } from "../components/About/About";

import { usePortfolioData } from "../utils/usePortfolioData";

const IndexPage: NextPage = () => {
  const { t } = useTranslation("common");
  const { projects, experiences, loading } = usePortfolioData();


  return (
    <Layout title="Jorge Ignacio Garay">
      <Hero />

      {/* About Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-space-cyan to-space-accent">
            {t("about")}
          </h2>
          <div className="bg-space-light/50 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <About experiences={experiences} />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portafolio" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-space-cyan to-space-accent">
            {t("portfolio")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-white text-center col-span-3">Loading projects...</p>
            ) : (
              projects.map((project, index) => (
                <div key={index} className="h-96">
                  <ProjectCard {...project} techStack={project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(Boolean) : undefined} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10 bg-space-dark/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-space-cyan to-space-accent">
            {t("skills")}
          </h2>
          <Skills />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-space-cyan to-space-accent">
            {t("contact")}
          </h2>
          <h3 className="text-xl text-gray-300 mb-8">{t("connect")}</h3>
          <Contact />
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common"])),
    },
  };
};

export default IndexPage;
