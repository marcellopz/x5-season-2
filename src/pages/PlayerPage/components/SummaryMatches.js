import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PersonalMatch from "./PersonalMatch";
import {
  getMatchRoles,
  getRankChangeLog,
} from "../../../services/firebaseDatabase";
import "./SummaryMatches.css";
import { useParams } from "react-router-dom";

export default function SummaryMatches({
  games,
  filteredRole,
  setFilteredRole,
}) {
  const { t } = useTranslation();
  const [allMatchRoles, setAllMatchRoles] = useState({});
  const [allRankChangeLog, setAllRankChangeLog] = useState({});
  const { player } = useParams();

  const filteredEntries = useMemo(() => {
    const changeLog = Object.values(
      allRankChangeLog[player]?.[filteredRole] ?? {}
    );

    // Filter games based on role
    const filteredGames = Object.entries(games)
      .filter(([gameId, game]) => {
        if (filteredRole) {
          return (
            allMatchRoles[gameId]?.[game.summonerId]?.toLowerCase() ===
            filteredRole.toLowerCase()
          );
        }
        return true;
      })
      .map(([gameId, game]) => ({
        type: "game",
        gameId,
        game,
        timestamp: new Date(game.date).getTime(),
      }));

    // Add rank changes if filtering by role
    const rankChanges = filteredRole
      ? changeLog.map((change) => ({
          type: "rank_change",
          change,
          timestamp: change.timestamp,
        }))
      : [];

    // Combine and sort by timestamp (newest first)
    const combinedEntries = [...filteredGames, ...rankChanges].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    return combinedEntries;
  }, [games, allMatchRoles, filteredRole, allRankChangeLog, player]);

  useEffect(() => {
    getRankChangeLog().then(setAllRankChangeLog);
    getMatchRoles().then(setAllMatchRoles);
    return () => {};
  }, []);

  return (
    <div className="summary-matches-container">
      {filteredRole && (
        <div className="pm-filtered-role">
          <span>{t("playerPage.summary.filteredByRole")} </span>
          <span className="pm-filtered-role-name">{filteredRole}</span>
          <button
            className="pm-filtered-role-clear"
            onClick={() => setFilteredRole("")}
          >
            {t("playerPage.summary.clear")}
          </button>
        </div>
      )}
      {filteredEntries.map((entry, index) => {
        if (entry.type === "game") {
          return (
            <PersonalMatch
              key={entry.gameId}
              game={entry.game}
              gameId={entry.gameId}
              matchRoles={allMatchRoles[entry.gameId] ?? {}}
            />
          );
        } else if (entry.type === "rank_change") {
          return (
            <div
              key={`rank-change-${entry.change.timestamp}`}
              className="pm-filtered-role"
            >
              <div>
                <span>{t("playerPage.summary.rankChange")}: </span>
                <span className="pm-filtered-role-name">
                  {entry.change.role} {entry.change.oldRank} →{" "}
                  {entry.change.newRank}
                </span>
              </div>
              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                {new Date(entry.change.timestamp).toLocaleString()}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
