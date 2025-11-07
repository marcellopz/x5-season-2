import { Divider, Grid, Paper, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { isObjEmpty } from "../../utils/utils";
import "./OverallStats.css"; // Import component styles

const ProgressBar = ({ value, maxValue, color, isRed, isBlue }) => {
  const progressPercentage = (value / maxValue) * 100;
  const [currentProgress, setCurrentProgress] = React.useState(0);

  React.useEffect(() => {
    setCurrentProgress(progressPercentage);
  }, [progressPercentage]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div className="progress-bar-track">
          <div
            className={`progress-bar-indicator ${
              isRed ? "progress-bar-red" : ""
            } ${isBlue ? "progress-bar-blue" : ""}`}
            style={{
              width: `${currentProgress}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export const SideStatBox = ({ title, redSideStat, blueSideStat }) => {
  const { t } = useTranslation();

  return (
    <div className="side-stat-box">
      <Typography>{title}</Typography>
      <Divider className="side-stat-divider" />
      <div className="side-stat-row">
        <div className="side-stat-label red-team">
          {t("gameStats.sideStats.redSide")}:
        </div>
        <div className="side-stat-progress">
          <ProgressBar
            value={redSideStat}
            maxValue={redSideStat > blueSideStat ? redSideStat : blueSideStat}
            color="var(--red-vivid)"
            isRed={true}
          />
        </div>
        <div className="side-stat-value red-team">{redSideStat}</div>
      </div>
      <div className="side-stat-row">
        <div className="side-stat-label blue-team">
          {t("gameStats.sideStats.blueSide")}:
        </div>
        <div className="side-stat-progress">
          <ProgressBar
            value={blueSideStat}
            maxValue={redSideStat > blueSideStat ? redSideStat : blueSideStat}
            color="var(--blue-vivid)"
            isBlue={true}
          />
        </div>
        <div className="side-stat-value blue-team">{blueSideStat}</div>
      </div>
    </div>
  );
};

export default function OverallStats({ stats, hideMainStats }) {
  const { t } = useTranslation();

  const generalItems = useMemo(() => {
    if (!stats || isObjEmpty(stats)) {
      return [];
    }
    return [
      <>
        <b>{t("gameStats.general.numberOfGames")}:</b> {stats.numberOfGames}
      </>,
      <>
        <b>{t("gameStats.general.averageGameDuration")}:</b>{" "}
        {(stats.gameDurationTotal / stats.numberOfGames / 60).toFixed(1)}{" "}
        {t("gameStats.general.minutes")}
      </>,
      <>
        <b>{t("gameStats.general.championsPicked")}:</b>{" "}
        {Object.values(stats.champions).filter((c) => c.picks > 0).length}
      </>,
      <>
        <b>{t("gameStats.general.championsNeverPicked")}:</b>{" "}
        {Object.values(stats.champions).filter((c) => c.picks === 0).length}
      </>,
    ];
  }, [stats, t]);

  const sideRelatedItems = useMemo(() => {
    if (!stats || !stats.redSide || !stats.blueSide) {
      return [];
    }
    return [
      <SideStatBox
        title={t("gameStats.sideStats.wins")}
        redSideStat={stats.redSide.wins}
        blueSideStat={stats.blueSide.wins}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.baronsKilled")}
        redSideStat={stats.redSide.baronKills}
        blueSideStat={stats.blueSide.baronKills}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.dragonsKilled")}
        redSideStat={stats.redSide.dragonKills}
        blueSideStat={stats.blueSide.dragonKills}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.riftHeraldsKilled")}
        redSideStat={stats.redSide.riftHeraldKills}
        blueSideStat={stats.blueSide.riftHeraldKills}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.turretsDestroyed")}
        redSideStat={stats.redSide.towerKills}
        blueSideStat={stats.blueSide.towerKills}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.firstBloods")}
        redSideStat={stats.redSide.firstBlood}
        blueSideStat={stats.blueSide.firstBlood}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.killedFirstBaron")}
        redSideStat={stats.redSide.firstBaron}
        blueSideStat={stats.blueSide.firstBaron}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.killedFirstDragon")}
        redSideStat={stats.redSide.firstDragon}
        blueSideStat={stats.blueSide.firstDragon}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.destroyedFirstInhibitor")}
        redSideStat={stats.redSide.firstInhibitor}
        blueSideStat={stats.blueSide.firstInhibitor}
      />,
      <SideStatBox
        title={t("gameStats.sideStats.destroyedFirstTower")}
        redSideStat={stats.redSide.firstTower}
        blueSideStat={stats.blueSide.firstTower}
      />,
    ];
  }, [stats, t]);

  if (!stats || isObjEmpty(stats)) {
    return (
      <div className="stats-container">
        <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
          {t("common.noDataYet")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-inner-container">
        {!hideMainStats && (
          <Paper className="general-stats-paper">
            {generalItems.map((item, i) => (
              <div className="general-stat-item" key={i}>
                {item}
              </div>
            ))}
          </Paper>
        )}
        <Grid container spacing={2}>
          {sideRelatedItems.map((i, j) => (
            <Grid item key={j} xs={12} sm={6} md={4} lg={3}>
              {i}
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
