import React from "react";
import GreenButton from "../buttons/green-button";
import {useTranslation} from "react-i18next";

const AboutSection = () => {
  const translationStrSet = {
    title:"Find Compassionate Care, Simplified.",
    body: "Whether you’re searching for a reliable healthcare aid or looking to offer your services, Care My Way makes the process effortless. We provide a trusted platform where families can connect with qualified healthcare aids who match your unique needs.",
    buttonLabel: "Find a Healthcare Provider"
  };
  // const { t } = useTranslation();
  return (
    <section className="bg-medium-green py-20 md:py-32">
      <div className="container mx-auto flex flex-col items-center px-4 max-w-3xl">
        <p className="text-primary-white text-center text-lg md:text-2xl mb-10">
          {(translationStrSet.title)}
          <br />
          {(translationStrSet.body)}
        </p>
        <GreenButton
          href="/marketplace"
          variant="route"
          className="text-lg px-8 py-3"
        >
          {(translationStrSet.buttonLabel)}
        </GreenButton>
      </div>
    </section>
  );
};

export default AboutSection;
