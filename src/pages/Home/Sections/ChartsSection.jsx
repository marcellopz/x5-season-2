import React from "react";
import { Box } from "@mui/material";
import GamesGraph from "../GraphComponents/GamesGraph";
import HourlyDistribution from "../GraphComponents/HourlyDistribution";
import WeekDayDistribution from "../GraphComponents/WeekDayDistribution";
import GameDurationHistogram from "../GraphComponents/GameDurationHistogram";
import "./ChartsSection.css";

const ChartsSection = ({ stats }) => {
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
