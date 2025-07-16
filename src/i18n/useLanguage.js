import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const isEnglish = () => {
    return i18n.language === "en";
  };

  const isPortuguese = () => {
    return i18n.language === "pt";
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    isEnglish,
    isPortuguese,
    currentLanguage: i18n.language,
  };
};
