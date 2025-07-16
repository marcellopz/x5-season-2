import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SideStatBox } from "../../GameStats/OverallStats";
import "./OverallStatsSection.css";

const OverallStatsSection = ({ stats }) => {
  const { t } = useTranslation();

  // Organize stats into logical categories for better presentation
  const objectiveStats = useMemo(() => {
    if (!stats || !stats.redSide || !stats.blueSide) return [];

    return [
      {
        title: t("home.overallStats.baronsKilled"),
        redSideStat: stats.redSide.baronKills,
        blueSideStat: stats.blueSide.baronKills,
      },
      {
        title: t("home.overallStats.dragonsKilled"),
        redSideStat: stats.redSide.dragonKills,
        blueSideStat: stats.blueSide.dragonKills,
      },
      {
        title: t("home.overallStats.riftHeraldsKilled"),
        redSideStat: stats.redSide.riftHeraldKills,
        blueSideStat: stats.blueSide.riftHeraldKills,
      },
      {
        title: t("home.overallStats.turretsDestroyed"),
        redSideStat: stats.redSide.towerKills,
        blueSideStat: stats.blueSide.towerKills,
      },
    ];
  }, [stats, t]);

  const firstObjectiveStats = useMemo(() => {
    if (!stats || !stats.redSide || !stats.blueSide) return [];

    return [
      {
        title: t("home.overallStats.firstBloods"),
        redSideStat: stats.redSide.firstBlood,
        blueSideStat: stats.blueSide.firstBlood,
      },
      {
        title: t("home.overallStats.killedFirstBaron"),
        redSideStat: stats.redSide.firstBaron,
        blueSideStat: stats.blueSide.firstBaron,
      },
      {
        title: t("home.overallStats.killedFirstDragon"),
        redSideStat: stats.redSide.firstDragon,
        blueSideStat: stats.blueSide.firstDragon,
      },
      {
        title: t("home.overallStats.destroyedFirstTower"),
        redSideStat: stats.redSide.firstTower,
        blueSideStat: stats.blueSide.firstTower,
      },
      {
        title: t("home.overallStats.destroyedFirstInhibitor"),
        redSideStat: stats.redSide.firstInhibitor,
        blueSideStat: stats.blueSide.firstInhibitor,
      },
      {
        title: t("home.overallStats.wins"),
        redSideStat: stats.redSide.wins,
        blueSideStat: stats.blueSide.wins,
      },
    ];
  }, [stats, t]);

  // Guard against missing stats for rendering
  if (!stats || !stats.redSide || !stats.blueSide) {
    return null;
  }

  return (
    <Box className="overall-stats-section-container" id="overall-stats-section">
      <Box className="stats-grid-container">
        {/* Objectives Stats Grid */}
        <Box className="stats-category">
          <Typography variant="h6" className="category-title">
            {t("home.overallStats.objectivesTaken")}
          </Typography>
          <Box className="stats-items-grid">
            {objectiveStats.map((stat, index) => (
              <Box key={`objective-${index}`} className="stat-item">
                <SideStatBox
                  title={stat.title}
                  redSideStat={stat.redSideStat || 0}
                  blueSideStat={stat.blueSideStat || 0}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* First Objectives Stats Grid */}
        <Box className="stats-category">
          <Typography variant="h6" className="category-title">
            {t("home.overallStats.firstObjectivesWins")}
          </Typography>
          <Box className="stats-items-grid">
            {firstObjectiveStats.map((stat, index) => (
              <Box key={`first-objective-${index}`} className="stat-item">
                <SideStatBox
                  title={stat.title}
                  redSideStat={stat.redSideStat || 0}
                  blueSideStat={stat.blueSideStat || 0}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OverallStatsSection;
