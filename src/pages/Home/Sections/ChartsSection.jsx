import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GamesGraph from "../GraphComponents/GamesGraph";
import HourlyDistribution from "../GraphComponents/HourlyDistribution";
import WeekDayDistribution from "../GraphComponents/WeekDayDistribution";
import GameDurationHistogram from "../GraphComponents/GameDurationHistogram";
import "./ChartsSection.css";

const ChartsSection = ({ stats }) => {
  const { t } = useTranslation();

  if (!stats || stats === null) {
    return (
      <Box className="charts-section-container" id="charts-section">
        <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
          {t("common.noDataYet")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="charts-section-container" id="charts-section">
      <Box className="charts-grid-container">
        <GamesGraph stats={stats} />
        <HourlyDistribution stats={stats} />
        <WeekDayDistribution stats={stats} />
        <GameDurationHistogram stats={stats} />
      </Box>
    </Box>
  );
};

export default ChartsSection;
