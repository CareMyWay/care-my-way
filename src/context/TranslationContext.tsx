import React, { createContext, useContext, useState, ReactNode } from "react";
import i18n from "@/components/language-switch/i18n";

type TranslationContextType = {
  language: string;
  changeLanguage: (lng: string) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(i18n.language || "en");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => { console.info("Language changed to", lng);});
    setLanguage(lng);
  };

  return (
    <TranslationContext.Provider value={{ language, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslationContext must be used within a TranslationProvider");
  }
  return context;
};
