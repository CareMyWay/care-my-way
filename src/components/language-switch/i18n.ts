import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {getTranslation} from "@/components/language-switch/awsTranslate";
import lanSrcJson from "src/components/language-switch/locales-common.json";

i18n
  // .use(HttpApi) // loads translations via HTTP (e.g. from /public/locales)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: {
      "zh-TW": ["en"],
      "default": ["en"]
    },
    supportedLngs: ["en", "fr", "es", "zh-TW", "pa", "hi", "tl", "zh", "it", "de", "pt", "ru", "ta", "vi", "gu", "ko", "pl", "el", "uk", "bn", "ro"], // "ar", "ur", "fa", "he",

    ns: ["common"],
    defaultNS: "common",

    resources: lanSrcJson,
    // backend: {
    //   loadPath: "/locales/{{lng}}-{{ns}}.json", // folder structure in /public -- "/locales/{{lng}}/{{ns}}.json"
    // },

    interpolation: {
      escapeValue: false, // React already escapes
    },
    saveMissing: true,
    missingKeyHandler: async (lng, ns, key, fallbackValue) => {
      const targetLang = i18n.language;
      if (key !== "DUMMY STRING") {
        if (targetLang !== "en" && (!i18n.hasResourceBundle(targetLang, "common") || !i18n.exists(key, { lng: targetLang, ns: "common" }))) {
          // console.log(`${targetLang}:${key} -fb-> ${fallbackValue}`);
          const translated = await getTranslation(fallbackValue || key, targetLang);  // You can also dynamically add this to i18next
          i18n.addResource(targetLang, ns, key, translated);
        }
      }
    },
    returnEmptyString: false, // <== important: treat empty string as missing
  })
  .then(() => {console.info(`i18n initialized -- ${i18n.language}`);})
  .then(() => {console.info(`MON=[${i18n.getResource( "zhcn", "common", "MON" )}]`);})
  .catch((e) => {console.error("i18n initialization error", e);});

export default i18n;
