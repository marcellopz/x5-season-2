import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import GameDurationHistogram from "../GraphComponents/GameDurationHistogram";
import "./GameDurationSection.css";

const GameDurationSection = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <Box className="game-duration-section-container" id="game-duration-section">
      <Box className="game-duration-content">
        <Box className="game-duration-graph">
          <GameDurationHistogram stats={stats} />
        </Box>
        <Box className="game-duration-placeholder">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t("home.gameDurationSection.incompleteSection")}
          </Typography>
          <ul className="feature-list">
            <li>{t("home.gameDurationSection.averageDurationByChampion")}</li>
            <li>{t("home.gameDurationSection.durationTrends")}</li>
            <li>{t("home.gameDurationSection.winRateAnalysis")}</li>
            <li>{t("home.gameDurationSection.correlationAnalysis")}</li>
          </ul>
          <Button variant="outlined" color="primary" sx={{ mt: 2 }} disabled>
            {t("home.gameDurationSection.comingSoon")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GameDurationSection;
