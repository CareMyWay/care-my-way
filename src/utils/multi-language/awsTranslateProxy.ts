"use server";

import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import fs from "fs";

const translateClient = new TranslateClient({
  region: process.env.NEXT_PUBLIC_DYNAMODB_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!
  }
});
// console.log("set region:", process.env.TRANSLATE_REGION!);
// console.log("set key-id:", process.env.ACCESS_KEY_ID!);
// console.log("set accKey:", process.env.SECRET_ACCESS_KEY!);

const cache: Record<string, string> = {};

export async function getTranslationProxy(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${targetLang}:${text}`;
  if (cache[cacheKey]) return cache[cacheKey];

  // console.info(`--->: [${targetLang}]: ${text}`);

  try {
    const command = new TranslateTextCommand({
      SourceLanguageCode: "en",
      TargetLanguageCode: targetLang,
      Text: text,
    });

    const result = await translateClient.send(command);

    const translated = result.TranslatedText || text;
    cache[cacheKey] = translated;

    fs.appendFile("src/utils/multi-language/locales/logs/patch.json.txt", `${targetLang}^#^${text}^#^${translated}\r\n`, (err) => {
      if (err) {
        console.error("Failed to write log to file:", err);
      }
      // console.log('Log received and written:', `[en]: ${text} -> [${targetLang}]: ${translated}`);
    });

    return translated;
  } catch (err) {
    console.error(err);
    // here it should raise the e, but, for test, I will return a string instead
    return "DUMMY STRING";
  }


}
