import { Predictions } from "@aws-amplify/predictions";

export async function translateText(textToTranslate: string, targetLanguage: string, sourceLanguage: string = "en") {
  try {
    const result = await Predictions.convert({
      translateText: {
        source: {
          text: textToTranslate,
          language: sourceLanguage // Optional: defaults configured on amplifyconfiguration.json
        },
        targetLanguage: targetLanguage
      }
    });
    console.log("Translated text:", result.text);
    return result.text;
  } catch (err) {
    console.error("Translation error:", err);
    return null;
  }
}
