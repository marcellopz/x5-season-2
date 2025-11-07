import React, { useContext, useEffect, useState } from "react";
import { getOverallStats, getPlayer } from "../../services/firebaseDatabase";
import { MiscContext } from "../../contexts/miscContext";
import X5pageContentArea from "../../common-components/X5pageContentArea";
import MainSection from "./Sections/MainSection";
import ChartsSection from "./Sections/ChartsSection";
import OverallStatsSection from "./Sections/OverallStatsSection";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import "./home.css";

export default function Home() {
  const { getCardbackground } = useContext(MiscContext);
  const { t } = useTranslation();
  const [players, setPlayers] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stats_ = await getOverallStats();
      setStats(stats_);
      setLoading(false);
    })();
    return () => {
      setLoading(true);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const players_ = await getPlayer("");
      setPlayers(players_);
    })();
    getCardbackground();
  }, [getCardbackground]);

  if (!loading && stats === null) {
    return (
      <X5pageContentArea noBackground removeMarginTop>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
          {t("common.noDataYet")}
        </Typography>
      </X5pageContentArea>
    );
  }

  return (
    <X5pageContentArea noBackground removeMarginTop loading={loading}>
      <MainSection stats={stats} players={players} />
      <ChartsSection stats={stats} />
      <OverallStatsSection stats={stats} />
    </X5pageContentArea>
  );
}
