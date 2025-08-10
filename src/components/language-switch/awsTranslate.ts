import AWS from "aws-sdk";

// ⚠️ Use secure credentials in production!
AWS.config.update({
  region: "canada-central",
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!,
});

// const translate = new AWS.Translate();
const cache: Record<string, string> = {};

export async function getTranslation(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${targetLang}:${text}`;
  if (cache[cacheKey]) return cache[cacheKey];

  // const result = await translate.translateText({
  //   SourceLanguageCode: "en",
  //   TargetLanguageCode: targetLang,
  //   Text: text,
  // }).promise();
  // const translated = result.TranslatedText || text;

  const response = await fetch("http://localhost:8080/proxy/trans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: text,
      frLang: "en", // Spanish
      toLang: targetLang, // Spanish
    })
  });
  const data = await response.json();
  const translated: string = data.targetText || text;

  cache[cacheKey] = translated;
  return translated;
}
