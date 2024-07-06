import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Language = {
  label: string;
  flag: string;
  shortName: string;
};

export const languages: Language[] = [
  {
    label: "English",
    flag: "🇬🇧",
    shortName: "en",
  },
  {
    label: "Español",
    flag: "🇪🇸",
    shortName: "es",
  },
  {
    label: "Français",
    flag: "🇫🇷",
    shortName: "fr",
  },
];

export const useLanguageHook = (): {
  change: (newLanguage: Language) => void;
  allLanguages: Language[];
  currentLanguage: Language | undefined;
} => {
  const { i18n } = useTranslation();
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();

  useEffect(() => {
    setAllLanguages(languages);
    const savedLanguage = localStorage.getItem("selectedLanguage") ?? "English";

    let choosedLanguage = languages.find(
      (lang) => lang.label === savedLanguage
    );
    if (!choosedLanguage) {
      choosedLanguage = languages.find((lang) => lang.label === "English");
    }
    if (currentLanguage) {
      setCurrentLanguage(choosedLanguage);
      localStorage.setItem("selectedLanguage", currentLanguage.label);
      void i18n.changeLanguage(currentLanguage.shortName);
    } else {
      console.error(
        "No valid language found, please check the languages configuration."
      );
    }
  }, [i18n]);

  const change = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
    localStorage.setItem("selectedLanguage", newLanguage.label);
    void i18n.changeLanguage(newLanguage.shortName);
  };

  return {
    change,
    allLanguages,
    currentLanguage,
  };
};
