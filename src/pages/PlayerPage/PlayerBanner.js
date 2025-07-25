import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import CardComponent from "../../common-components/CardDisplay/CardComponent";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import CircularProgressWithLabel from "./components/CircularProgressWithLabel";
import { getChampionSplash } from "../../common-components/resources";
import { floatToPercentageString } from "../../utils/utils";
import lanes from "../../assets/images/lanes";
import "./PlayerBanner.css";

const roles = ["top", "jungle", "mid", "adc", "support"];

function PlayerBanner({
  champs,
  playerKey,
  playerInfo,
  selectedPlayerCardStats,
  setSelectedTab,
  selectedTab,
  filteredRole,
  setFilteredRole,
}) {
  const { t } = useTranslation();

  const handleOpggRedirect = () => {
    const region = "br";
    const summonerName = playerInfo.summonerName;
    const tagLine = playerInfo.tagLine;
    const opggUrl = `https://www.op.gg/summoners/${region}/${summonerName}-${tagLine}`;
    window.open(opggUrl, "_blank");
  };

  return (
    <div
      className="pb-banner"
      style={{
        backgroundImage:
          champs.length > 0
            ? `url(${getChampionSplash(champs[0].championId)})`
            : undefined,
      }}
    >
      <div className="pb-content">
        <div className="pb-left-section">
          {selectedPlayerCardStats && (
            <CardComponent
              name={playerKey}
              ranks={selectedPlayerCardStats}
              label={selectedPlayerCardStats.name}
              sx={{
                height: "300px",
                width: "216px",
              }}
            />
          )}
          <div className="pb-player-info">
            <div className="pb-player-name-container">
              <Typography className="pb-player-name">
                {playerInfo.summonerName}
              </Typography>
              {playerInfo.tagLine && (
                <Typography className="pb-player-tagline">
                  #{playerInfo.tagLine}
                </Typography>
              )}
              <img
                src="/opgg.png"
                alt="OP.GG"
                className="pb-opgg-icon"
                onClick={handleOpggRedirect}
              />
            </div>
            <Typography>
              {t("playerPage.banner.numberOfMatches", {
                count: playerInfo.numberOfMatches,
              })}
            </Typography>
          </div>
        </div>

        <div className="pb-stats-container">
          <Box className="pb-winrate-box">
            <CircularProgressWithLabel
              value={playerInfo.winRate}
              size={176}
              label={`${floatToPercentageString(playerInfo.winRate)} ${t(
                "playerPage.banner.winRate"
              )}`}
              labelFontSize={25}
            />
          </Box>
          <Box className="pb-roles-box">
            {roles.map((role, i) => (
              <div
                className={`pb-role-stat ${
                  filteredRole === role ? "role-selected" : ""
                }`}
                key={i}
                onClick={() =>
                  setFilteredRole((prev) => (prev === role ? "" : role))
                }
              >
                <img src={lanes[i]} alt={role} className="pb-role-icon" />
                <span className="pb-role-winrate">
                  <p>
                    {floatToPercentageString(
                      playerInfo.roleMatches[role].wins /
                        playerInfo.roleMatches[role].games
                    )}
                  </p>
                  <p>
                    {`${playerInfo.roleMatches[role].wins} ${t(
                      "playerPage.match.wins"
                    )} ${
                      playerInfo.roleMatches[role].games -
                      playerInfo.roleMatches[role].wins
                    } ${t("playerPage.match.losses")}`}
                  </p>
                </span>
              </div>
            ))}
          </Box>
        </div>
      </div>
      <div className="pb-tabs-container">
        <Tabs
          onChange={(e, v) => setSelectedTab(v)}
          value={selectedTab}
          sx={{
            "& button": {
              color: "primary.light",
            },
          }}
        >
          <Tab label={t("playerPage.tabs.summary")} value={0} />
          <Tab label={t("playerPage.tabs.champions")} value={1} />
          <Tab label={t("playerPage.tabs.stats")} value={2} />
          <Tab label={t("playerPage.tabs.records")} value={3} />
        </Tabs>
      </div>
    </div>
  );
}

export default memo(PlayerBanner);
