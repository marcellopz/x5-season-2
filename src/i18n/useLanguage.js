import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    console.log(`Changing language to: ${lng}`);
    i18n.changeLanguage(lng).then(() => {
      console.log(
        `Language changed successfully. Current language: ${i18n.language}`
      );
      console.log(`localStorage value: ${localStorage.getItem("i18nextLng")}`);
    });
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
