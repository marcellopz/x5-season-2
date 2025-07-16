import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Language } from "@mui/icons-material";
import { useLanguage } from "../../i18n/useLanguage";

const LanguageSwitcher = () => {
  const { changeLanguage, isEnglish } = useLanguage();

  const handleLanguageToggle = () => {
    const newLanguage = isEnglish() ? "pt" : "en";
    changeLanguage(newLanguage);
  };

  const getTooltipText = () => {
    return isEnglish() ? "Switch to Portuguese" : "Mudar para Inglês";
  };

  const getDisplayText = () => {
    return isEnglish() ? "EN" : "PT";
  };

  return (
    <Tooltip title={getTooltipText()}>
      <IconButton
        onClick={handleLanguageToggle}
        sx={{
          color: "var(--navbar-text)",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          borderRadius: "5px",
          gap: "4px",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Language fontSize="small" />
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          {getDisplayText()}
        </span>
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSwitcher;
