import * as fs from "fs";
import * as readline from "readline";

// const languageNameArray: ILanguageName[] = ["en", "fr", "es", "zh-TW", "pa", "ar", "hi", "tl", "zh", "it", "de", "ur", "pt", "ru", "ta", "vi", "fa", "gu", "ko", "pl", "el", "uk", "bn", "ro", "he"];
// type ILanguageName = "en" | "fr" | "es" | "zh-TW" | "pa" | "ar" | "hi" | "tl" | "zh" | "it" | "de" | "ur" | "pt" | "ru" | "ta" | "vi" | "fa" | "gu" | "ko" | "pl" | "el" | "uk" | "bn" | "ro" | "he";

const getResources = async () => {
  console.info("----->: ", "src/components/language-switch/i18n_lang_init.ts:getResources() is called.");

  const namespaceName = "common";

  const outputFileName = "src/components/language-switch/locales-common.json";
  const backupFileName = `src/components/language-switch/locales/bak/locales-common.bak.${Date.now()}.json`;
  const patchFileName = "src/components/language-switch/locales/patch.json.txt";

  const allTranslations = JSON.parse(fs.readFileSync(outputFileName, "utf8"));

  try{
    const fileContent: Buffer = fs.readFileSync(outputFileName);
    fs.writeFileSync(backupFileName, fileContent);

    const fileStream = fs.createReadStream(patchFileName);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const transEntry: string[] = line.trim().split("^#^");
      // console.info(`----->: allTranslations['${transEntry[0]}']['${namespaceName}'].length='${allTranslations[transEntry[0]][namespaceName].length}'`);
      // console.info(`----->: allTranslations['${transEntry[0]}']['${namespaceName}'].length='${allTranslations[transEntry[0]][namespaceName].length}'`);
      // console.info(`----->: allTranslations['${transEntry[0]}']['${namespaceName}']['${transEntry[1]}']='${transEntry[2]}'`);
      allTranslations[transEntry[0]][namespaceName][transEntry[1]] = transEntry[2];
    }

    fs.writeFileSync(outputFileName, JSON.stringify(allTranslations, null, 2));

    console.info("----->: ", JSON.stringify(allTranslations).substring(0, 200));
  }catch(e){
    console.error(e);
    console.error(e.message);
  }
  return allTranslations;
};

getResources().then(() => {});

// call me: node --import=tsx  src/components/language-switch/locales/PatchTxt2Json.ts


