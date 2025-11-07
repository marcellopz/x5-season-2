import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import X5pageContentArea from "../../common-components/X5pageContentArea";
import { getOverallStats } from "../../services/firebaseDatabase";
import OverallStats from "./OverallStats";
import ChampionStats from "./ChampionStats";
import { isObjEmpty } from "../../utils/utils";
import { Typography } from "@mui/material";

export default function GameStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stats_ = await getOverallStats();
      setStats(stats_);
      setLoading(false);
    })();
  }, []);

  if (!loading && stats === null) {
    return (
      <X5pageContentArea title={t("gameStats.title")}>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
          {t("common.noDataYet")}
        </Typography>
      </X5pageContentArea>
    );
  }

  return (
    <X5pageContentArea title={t("gameStats.title")} loading={loading || isObjEmpty(stats)}>
      <OverallStats stats={stats} />
      <ChampionStats champions={stats?.champions} />
    </X5pageContentArea>
  );
}
