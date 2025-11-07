import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CHAMPIONICONURL } from "../../common-components/resources";
import { formatNumber } from "../../utils/utils";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import "./PlayerTabs.css";

const Tab = ({ setTabState, tabState, n, champId }) => (
  <div
    className={`pt-tab ${tabState === n ? "pt-tab-active" : "pt-tab-inactive"}`}
    onClick={() => setTabState(n)}
  >
    <div className="pt-tab-content">
      <img
        src={`${CHAMPIONICONURL}${champId}.png`}
        width={40}
        height={40}
        alt={champId}
      />
    </div>
  </div>
);

const StatBox = ({ number, text }) => (
  <div className="pt-stat-box">
    <p className="pt-stat-number">{formatNumber(number)}</p>
    <p className="pt-stat-text">{text}</p>
  </div>
);

// Component for rendering summoner name with tagline
const SummonerNameCell = ({ summonerName, tagLine }) => {
  return (
    <div
      className="pt-summoner-name-container"
      title={`${summonerName}#${tagLine}`}
    >
      <span className="pt-summoner-name">{summonerName}</span>
      {tagLine && <span className="pt-summoner-tagline">#{tagLine}</span>}
    </div>
  );
};

export default function PlayerTabs({ matchData }) {
  const { t } = useTranslation();
  const [tabState, setTabState] = useState(0);

  if (!matchData || !matchData.participants || matchData.participants.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
        {t("common.noDataYet")}
      </Typography>
    );
  }

  const curr_p = matchData.participants[tabState];

  return (
    <div className="pt-container">
      <div className="pt-tabs-row">
        {matchData.participants.map((p, i) => (
          <Tab
            champId={p.championId}
            n={i}
            setTabState={setTabState}
            tabState={tabState}
            key={i}
          />
        ))}
      </div>
      <div>
        <Link to={`/player/${curr_p.identity.player.summonerId}`}>
          <SummonerNameCell
            summonerName={curr_p.identity.player.gameName}
            tagLine={curr_p.identity.player.tagLine}
          />
        </Link>

        <div className="pt-stats-container">
          <StatBox
            number={(
              (curr_p.stats.kills + curr_p.stats.assists) /
              curr_p.stats.deaths
            ).toFixed(2)}
            text={t("matchPage.playerStats.kda")}
          />
          <StatBox
            number={curr_p.stats.doubleKills}
            text={t("matchPage.playerStats.doubleKills")}
          />
          <StatBox
            number={curr_p.stats.tripleKills}
            text={t("matchPage.playerStats.tripleKills")}
          />
          <StatBox
            number={curr_p.stats.quadraKills}
            text={t("matchPage.playerStats.quadraKills")}
          />
          <StatBox
            number={curr_p.stats.pentaKills}
            text={t("matchPage.playerStats.pentaKills")}
          />
          <StatBox
            number={(
              curr_p.stats.totalDamageDealtToChampions / curr_p.stats.kills
            ).toFixed(2)}
            text={t("matchPage.playerStats.damagePerKill")}
          />
          <StatBox
            number={curr_p.stats.totalDamageDealtToChampions}
            text={t("matchPage.playerStats.damageToChampions")}
          />
          <StatBox
            number={curr_p.stats.damageDealtToTurrets}
            text={t("matchPage.playerStats.damageToTurrets")}
          />
          <StatBox
            number={curr_p.stats.largestKillingSpree}
            text={t("matchPage.playerStats.largestKillingSpree")}
          />
          <StatBox
            number={curr_p.stats.goldEarned}
            text={t("matchPage.playerStats.goldEarned")}
          />
          <StatBox
            number={curr_p.stats.wardsKilled}
            text={t("matchPage.playerStats.wardsDestroyed")}
          />
          <StatBox
            number={curr_p.stats.wardsPlaced}
            text={t("matchPage.playerStats.wardsPlaced")}
          />
          <StatBox
            number={curr_p.stats.visionScore}
            text={t("matchPage.playerStats.visionScore")}
          />
          <StatBox
            number={curr_p.stats.visionWardsBoughtInGame}
            text={t("matchPage.playerStats.visionWardsBought")}
          />
          <StatBox
            number={curr_p.stats.totalHeal}
            text={t("matchPage.playerStats.totalHealing")}
          />
          <StatBox
            number={curr_p.stats.totalDamageTaken}
            text={t("matchPage.playerStats.totalDamageTaken")}
          />
        </div>
      </div>
    </div>
  );
}
