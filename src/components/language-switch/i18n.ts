import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import {resources} from "@/components/language-switch/i18n_lang_init";

i18n
  // .use(HttpApi) // loads translations via HTTP (e.g. from /public/locales)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "es", "zhtw", "pa", "ar", "hi", "tl", "zhcn", "it", "de", "ur", "pt", "ru", "ta", "vi", "fa", "gu", "ko", "pl", "el", "uk", "bn", "ro", "he"],

    ns: ["common"],
    defaultNS: "common",

    resources,
    // backend: {
    //   loadPath: "/locales/{{lng}}-{{ns}}.json", // folder structure in /public -- "/locales/{{lng}}/{{ns}}.json"
    // },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    returnEmptyString: false, // <== important: treat empty string as missing
  })
  .then(() => {console.info(`i18n initialized -- ${i18n.language}`);})
  .catch((e) => {console.error("i18n initialization error", e);});

export default i18n;
