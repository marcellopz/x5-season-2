import { ArrowRight } from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const getRecordsTags = (t) => [
  {
    key: "kills",
    title: t("playerPage.records.titles.kills"),
    format: false,
  },
  {
    key: "deaths",
    title: t("playerPage.records.titles.deaths"),
    format: false,
  },
  {
    key: "assists",
    title: t("playerPage.records.titles.assists"),
    format: false,
  },
  {
    key: "cs",
    title: t("playerPage.records.titles.cs"),
    format: false,
  },
  {
    key: "csPerMin",
    title: t("playerPage.records.titles.csPerMin"),
    format: (v) => v.toFixed(2),
  },
  {
    key: "damage",
    title: t("playerPage.records.titles.damage"),
    format: false,
  },
  {
    key: "damageTaken",
    title: t("playerPage.records.titles.damageTaken"),
    format: false,
  },
  {
    key: "multiKill",
    title: t("playerPage.records.titles.multiKill"),
    format: false,
  },
  {
    key: "killingSpree",
    title: t("playerPage.records.titles.killingSpree"),
    format: false,
  },
  {
    key: "longestGame",
    title: t("playerPage.records.titles.longestGame"),
    format: (v) => `${(v / 60).toFixed(1)} min`,
  },
  {
    key: "shortestGame",
    title: t("playerPage.records.titles.shortestGame"),
    format: (v) => `${(v / 60).toFixed(1)} min`,
  },
  {
    key: "visionScore",
    title: t("playerPage.records.titles.visionScore"),
    format: false,
  },
];

const RecordBox = ({ title, value, win, gameId, t }) => (
  <Paper
    sx={{
      width: "250px",
      height: "130px",
      background: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }}
  >
    <div
      style={{
        margin: "10px 15px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ display: "flex", alignItems: "center" }}>
        {title}
      </Typography>
      <Link to={`/match/${gameId}`} title={t("playerPage.records.showMatch")}>
        <IconButton size="small">
          <ArrowRight />
        </IconButton>
      </Link>
    </div>
    <Typography
      component="div"
      sx={{
        textAlign: "end",
        fontSize: 40,
        margin: "15px 20px",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
      }}
    >
      <div>{value}</div>
      <div
        style={{
          fontSize: 15,
          opacity: 0.3,
          alignItems: "center",
          display: "flex",
        }}
      >
        {win ? t("playerPage.match.wins") : t("playerPage.match.losses")}
      </div>
    </Typography>
  </Paper>
);

function PlayerRecordsTab({ records }) {
  const { t } = useTranslation();
  const recordsTags = getRecordsTags(t);

  return (
    <div
      style={{
        margin: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "space-evenly",
      }}
    >
      {recordsTags.map((tag) => {
        const record = records[tag.key];
        const value = !!tag.format ? tag.format(record.n) : record.n;
        return (
          <RecordBox
            key={tag.key}
            title={tag.title}
            value={value}
            win={record.win}
            gameId={record.gameId}
            t={t}
          />
        );
      })}
    </div>
  );
}

export default memo(PlayerRecordsTab);
