export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const langpair = `${sourceLang === "auto" ? "" : sourceLang}|${targetLang}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Translation service is currently unavailable. Please try again.");

  const data = await res.json();

  if (data.responseStatus !== 200 && data.responseStatus !== "200") {
    throw new Error(data.responseDetails || "Translation failed. Please check your input and try again.");
  }

  return data.responseData.translatedText;
}
