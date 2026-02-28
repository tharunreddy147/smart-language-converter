export interface Language {
  code: string;
  name: string;
}

export const languages: Language[] = [
  { code: "auto", name: "Auto Detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "uk", name: "Ukrainian" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" },
];

export const targetLanguages = languages.filter((l) => l.code !== "auto");
