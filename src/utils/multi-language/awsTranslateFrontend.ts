const cache: Record<string, string> = {};

export async function getTranslationFromFrontend(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${targetLang}:${text}`;
  if (cache[cacheKey]) return cache[cacheKey];
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


