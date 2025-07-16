import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CHAMPIONICONURL } from "../../common-components/resources";
import { floatToPercentageString, formatNumber } from "../../utils/utils";
import { Tooltip } from "@mui/material";
import "./DamageChart.css";

const Tab = ({ setTabState, tabState, n, text }) => (
  <div
    className={`tab ${tabState === n ? "tab-active" : "tab-inactive"}`}
    onClick={() => setTabState(n)}
  >
    <p className="tab-text">{text}</p>
  </div>
);

const tabKey = [
  "totalDamageDealtToChampions",
  "totalDamageTaken",
  "goldEarned",
  "visionScore",
];

const tabEmojis = ["⚔️", "🛡️", "💰", "👀"];

const sortFunctions = (t) => (a, b) => b.stats[tabKey[t]] - a.stats[tabKey[t]];

const TeamSection = ({
  team,
  teamName,
  tabState,
  max,
  teamClass,
  isBlueTeam,
}) => (
  <div className={`team-section ${teamClass}`}>
    <div className="team-title">
      <h3>{teamName}</h3>
    </div>
    <ul className="team-chart-content">
      {team.sort(sortFunctions(tabState)).map((p, i) => (
        <li className="match-chart-item" key={i}>
          <div className="chart-item-content">
            <img
              src={`${CHAMPIONICONURL}${p.championId}.png`}
              width={50}
              height={50}
              alt={p.championName}
            />
            <div className="chart-bar-container">
              <Tooltip title={formatNumber(p.stats[tabKey[tabState]])}>
                <div className="chart-bar">
                  <div
                    className={
                      isBlueTeam
                        ? tabState === 0
                          ? "blue-damage-bar"
                          : tabState === 1
                          ? "blue-damage-taken-bar"
                          : tabState === 2
                          ? "blue-gold-bar"
                          : "blue-vision-bar"
                        : tabState === 0
                        ? "red-damage-bar"
                        : tabState === 1
                        ? "red-damage-taken-bar"
                        : tabState === 2
                        ? "red-gold-bar"
                        : "red-vision-bar"
                    }
                    style={{
                      width: floatToPercentageString(
                        p.stats[tabKey[tabState]] / max
                      ),
                    }}
                  />
                </div>
              </Tooltip>
            </div>
            <div className="chart-value">
              <span className="chart-emoji">{tabEmojis[tabState]}</span>
              <span className="chart-number">
                {formatNumber(p.stats[tabKey[tabState]])}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default function DamageChart({ matchData }) {
  const { t } = useTranslation();
  const [tabState, setTabState] = useState(0);

  // Split participants into blue and red teams
  const blueTeam = matchData.participants.filter((p) => p.teamId === 100);
  const redTeam = matchData.participants.filter((p) => p.teamId === 200);

  // Calculate max value across all participants for proper scaling
  const max = Math.max(
    ...matchData.participants.map((o) => o.stats[tabKey[tabState]])
  );

  return (
    <div>
      <div className="tab-container">
        <Tab
          setTabState={setTabState}
          tabState={tabState}
          n={0}
          text={t("matchPage.damageChart.damage")}
        />
        <Tab
          setTabState={setTabState}
          tabState={tabState}
          n={1}
          text={t("matchPage.damageChart.damageTaken")}
        />
        <Tab
          setTabState={setTabState}
          tabState={tabState}
          n={2}
          text={t("matchPage.damageChart.gold")}
        />
        <Tab
          setTabState={setTabState}
          tabState={tabState}
          n={3}
          text={t("matchPage.damageChart.vision")}
        />
      </div>
      <div className="chart-content">
        <TeamSection
          team={blueTeam}
          teamName={t("matchPage.damageChart.blueTeam")}
          tabState={tabState}
          max={max}
          teamClass="blue-team-section"
          isBlueTeam={true}
        />
        <div className="team-divider"></div>
        <TeamSection
          team={redTeam}
          teamName={t("matchPage.damageChart.redTeam")}
          tabState={tabState}
          max={max}
          teamClass="red-team-section"
          isBlueTeam={false}
        />
      </div>
    </div>
  );
}
