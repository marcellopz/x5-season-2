import React, { useEffect, useState } from "react";
import X5pageContentArea from "../../common-components/X5pageContentArea";
import { getOverallStats } from "../../services/firebaseDatabase";
import OverallStats from "./OverallStats";
import ChampionStats from "./ChampionStats";
import { isObjEmpty } from "../../utils/utils";

export default function GameStats() {
  const [stats, setStats] = useState({});
  useEffect(() => {
    (async () => {
      const stats_ = await getOverallStats();
      setStats(stats_);
    })();
  }, []);
  if (!stats || isObjEmpty(stats)) {
    return (
      <div style={{ display: "flex", marginTop: "100px" }}>No data yet</div>
    );
  }
  return (
    <X5pageContentArea title="Stats" loading={isObjEmpty(stats)}>
      <OverallStats stats={stats} />
      <ChampionStats champions={stats.champions} />
    </X5pageContentArea>
  );
}
