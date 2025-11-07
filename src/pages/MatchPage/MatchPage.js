import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import X5pageContentArea from "../../common-components/X5pageContentArea";
import {
  getMatchRoles,
  getMatchesFullMatch,
} from "../../services/firebaseDatabase";
import {
  convertSecondsToMinutesAndSeconds2,
  timeSince,
} from "../../utils/utils";
import MatchComponent from "./MatchComponent";
import { Grid, Typography } from "@mui/material";
import DamageChart from "./DamageChart";
import PlayerTabs from "./PlayerTabs";
import "./MatchPage.css";

const MatchDetails = ({ date, matchData }) => {
  const { t } = useTranslation();

  return (
    <div className="match-details-container">
      <p>{`${t("matchPage.matchPlayed")} ${date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      })} (${timeSince(date, t)})`}</p>
      <p>{`${t("matchPage.gameDuration")}: ${convertSecondsToMinutesAndSeconds2(
        matchData.gameDuration
      )}`}</p>
      <p>{`${t("matchPage.matchId")}: ${matchData.gameId}`}</p>
    </div>
  );
};

const ExtraInfo = ({ matchData }) => (
  <Grid container sx={{ marginTop: "1px" }} spacing={3}>
    <Grid item xs={12} lg={4}>
      <DamageChart matchData={matchData} />
    </Grid>
    <Grid item xs={12} lg={8}>
      <PlayerTabs matchData={matchData} />
    </Grid>
  </Grid>
);

export default function MatchPage() {
  const { t } = useTranslation();
  const { matchid } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState();
  const [matchRoles, setMatchRoles] = useState();

  // Handle URL format conversion
  useEffect(() => {
    if (!matchid) return;

    // If the matchid starts with "match", it's the old format - redirect to new format
    if (matchid.startsWith("match")) {
      const numericId = matchid.replace("match", "");
      navigate(`/match/${numericId}`, { replace: true });
      return;
    }

    // For new format, add "match" prefix when calling backend
    const fullMatchId = `match${matchid}`;
    getMatchesFullMatch(fullMatchId).then((match) => setMatchData(match));
    getMatchRoles(fullMatchId).then((roles) => setMatchRoles(roles));
  }, [matchid, navigate]);

  const date = matchData ? new Date(matchData.gameCreationDate) : null;

  // Don't render if we're redirecting
  if (!matchid || matchid.startsWith("match")) {
    return null;
  }

  // Show message if matchData is null
  if (!matchData) {
    return (
      <X5pageContentArea title={t("matchPage.title")}>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
          {t("common.noDataYet")}
        </Typography>
      </X5pageContentArea>
    );
  }

  return (
    <X5pageContentArea title={t("matchPage.title")}>
      <div className="match-page-container">
        <MatchDetails date={date} matchData={matchData} />
        <MatchComponent matchData={matchData} matchRoles={matchRoles} />
        <ExtraInfo matchData={matchData} />
      </div>
    </X5pageContentArea>
  );
}
