import { TranslateClient } from "@aws-sdk/client-translate";
import { TranslateTextCommand, } from "@aws-sdk/client-translate";

const translateClient = new TranslateClient({
  region: "canada-central", // your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // load from env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "en"
): Promise<string> => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: sourceLanguage,
    TargetLanguageCode: targetLanguage,
  });

  const response = await translateClient.send(command);
  return response.TranslatedText || "";
};
