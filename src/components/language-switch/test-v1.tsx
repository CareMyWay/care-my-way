import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const resources = {
  en: { translation: { "Label: Welcome to React": "Welcome to React"                } },
  fr: { translation: { "Label: Welcome to React": "Bienvenue à React"               } },
  es: { translation: { "Label: Welcome to React": "Bienvenido a React"              } },   // Spanish
  sc: { translation: { "Label: Welcome to React": "欢迎使用 React"                    } },   // Mandarin (Simplified Chinese)
  pa: { translation: { "Label: Welcome to React": "React ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ"          } },    // Punjabi
  ar: { translation: { "Label: Welcome to React": "مرحبًا بك في React"               } },    // Arabic
  hi: { translation: { "Label: Welcome to React": "React में आपका स्वागत है"             } },   // Hindi
  tl: { translation: { "Label: Welcome to React": "Maligayang pagdating sa React"   } },    // Tagalog
  tc: { translation: { "Label: Welcome to React": "歡迎使用 React"                    } },   // Cantonese (Traditional Chinese)
  it: { translation: { "Label: Welcome to React": "Benvenuto in React"              } },    // Italian
  de: { translation: { "Label: Welcome to React": "Willkommen bei React"            } },    // German
  ur: { translation: { "Label: Welcome to React": "ری ایکٹ میں خوش آمدید"           } },    // Urdu
  pt: { translation: { "Label: Welcome to React": "Bem-vindo ao React"              } },    // Portuguese
  ru: { translation: { "Label: Welcome to React": "Добро пожаловать в React"        } },    // Russian
  ta: { translation: { "Label: Welcome to React": "ரியாக்ட்-க்கு வரவேற்கிறோம்"      } },    // Tamil
  vi: { translation: { "Label: Welcome to React": "Chào mừng đến với React"         } },    // Vietnamese
  fa: { translation: { "Label: Welcome to React": "به React خوش آمدید"              } },    // Persian
  gu: { translation: { "Label: Welcome to React": "React માં આપનું સ્વાગત છે"           } },    // Gujarati
  ko: { translation: { "Label: Welcome to React": "React에 오신 것을 환영합니다"        } },   //Korean
  pl: { translation: { "Label: Welcome to React": "Witamy w React"                  } },   // Polish
  el: { translation: { "Label: Welcome to React": "Καλώς ήρθατε στο React"          } },   // Greek
  uk: { translation: { "Label: Welcome to React": "Ласкаво просимо до React"        } },   // Ukrainian
  bn: { translation: { "Label: Welcome to React": "React-এ আপনাকে স্বাগতম"           } },   // Bengali
  ro: { translation: { "Label: Welcome to React": "Bine ai venit în React"          } },   // Romanian
  he: { translation: { "Label: Welcome to React": "ברוך הבא ל-React"                } }    // Hebrew
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // REACT already safes from xss
    }
  }).then(() => {});

export default i18n;
