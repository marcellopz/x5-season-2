import React, { useEffect, useState } from "react";
import PersonalMatch from "./PersonalMatch";
import { getMatchRoles } from "../../../services/firebaseDatabase";
import "./SummaryMatches.css";

export default function SummaryMatches({
  games,
  filteredRole,
  setFilteredRole,
}) {
  const [allMatchRoles, setAllMatchRoles] = useState({});

  useEffect(() => {
    getMatchRoles().then((r) => setAllMatchRoles(r));
    return () => {};
  }, []);

  return (
    <div className="summary-matches-container">
      {filteredRole && (
        <div className="pm-filtered-role">
          <span>Filtered by role: </span>
          <span className="pm-filtered-role-name">{filteredRole}</span>
          <button
            className="pm-filtered-role-clear"
            onClick={() => setFilteredRole("")}
          >
            Clear
          </button>
        </div>
      )}
      {Object.entries(games)
        .reverse()
        .filter(([gameId, game]) => {
          if (filteredRole) {
            return (
              allMatchRoles[gameId]?.[game.summonerId]?.toLowerCase() ===
              filteredRole.toLowerCase()
            );
          }
          return true;
        })
        .map(([gameId, game], i) => (
          <div key={i} style={{ marginTop: "15px" }}>
            <PersonalMatch
              game={game}
              gameId={gameId}
              matchRoles={allMatchRoles[gameId] ?? {}}
            />
          </div>
        ))}
    </div>
  );
}
