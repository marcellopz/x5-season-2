import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import {
  getRankChangeLog,
  getInitialRanks,
} from "../../../services/firebaseDatabase";
import "./PatchNotes.css";
import { Link } from "react-router-dom";

// Function to group changes by date (4 AM to 4 AM in Brazil timezone)
const groupChangesByDate = (logs, newPlayers = []) => {
  if (!logs) return {};

  // Flatten all rank changes into a single array
  const allChanges = [];

  Object.entries(logs).forEach(([playerId, roles]) => {
    Object.entries(roles).forEach(([role, changes]) => {
      Object.entries(changes).forEach(([changeId, change]) => {
        allChanges.push({
          ...change,
          changeId,
          type: "rank_change",
        });
      });
    });
  });

  // Add new players to the changes array
  newPlayers.forEach((player) => {
    allChanges.push({
      ...player,
      changeId: `new_player_${player.name_id}`,
      type: "new_player",
      timestamp: player.timestamp,
    });
  });

  // Group by adjusted date (4 AM to 4 AM)
  const groupedByDate = {};

  allChanges.forEach((change) => {
    // Convert timestamp to Date object in Brazil timezone (UTC-3)
    const utcDate = new Date(change.timestamp);
    const brazilDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000); // UTC-3

    // If hour is before 4 AM, consider it part of the previous day
    if (brazilDate.getHours() < 4) {
      brazilDate.setDate(brazilDate.getDate() - 1);
    }

    // Format date as YYYY-MM-DD
    const dateKey = brazilDate.toISOString().split("T")[0];

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }

    groupedByDate[dateKey].push(change);
  });

  // Sort dates and consolidate changes within each date
  const sortedDates = Object.keys(groupedByDate).sort().reverse(); // Most recent first
  const sortedGroupedByDate = {};

  sortedDates.forEach((date) => {
    const changesForDate = groupedByDate[date];

    // Separate new players from rank changes
    const newPlayerChanges = changesForDate.filter(
      (change) => change.type === "new_player"
    );
    const rankChanges = changesForDate.filter(
      (change) => change.type === "rank_change"
    );

    // Group rank changes by player+role combination
    const playerRoleGroups = {};

    rankChanges.forEach((change) => {
      const key = `${change.name_id}_${change.role}`;
      if (!playerRoleGroups[key]) {
        playerRoleGroups[key] = [];
      }
      playerRoleGroups[key].push(change);
    });

    // Consolidate rank changes for each player+role combination
    const consolidatedRankChanges = [];

    Object.values(playerRoleGroups).forEach((changes) => {
      // Sort changes by timestamp
      changes.sort((a, b) => a.timestamp - b.timestamp);

      const firstChange = changes[0];
      const lastChange = changes[changes.length - 1];

      // If initial rank equals final rank, ignore this change
      if (firstChange.oldRank === lastChange.newRank) {
        return;
      }

      // Create consolidated change
      consolidatedRankChanges.push({
        ...firstChange,
        newRank: lastChange.newRank,
        changeId: `${firstChange.changeId}_consolidated`,
        timestamp: firstChange.timestamp, // Use first change timestamp for sorting
      });
    });

    // Combine consolidated rank changes with new players
    const allChangesForDate = [...consolidatedRankChanges, ...newPlayerChanges];

    // Sort all changes by timestamp
    sortedGroupedByDate[date] = allChangesForDate.sort(
      (a, b) => a.timestamp - b.timestamp
    );
  });

  return sortedGroupedByDate;
};

// Helper function to format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Helper function to get rank change direction and color
const getRankChangeInfo = (oldRank, newRank) => {
  if (newRank > oldRank) {
    return { direction: "↗", color: "success", text: "promoted" };
  } else if (newRank < oldRank) {
    return { direction: "↙", color: "error", text: "demoted" };
  } else {
    return { direction: "→", color: "default", text: "no change" };
  }
};

const PatchNotes = () => {
  const [groupedChanges, setGroupedChanges] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const logs_ = await getRankChangeLog();
      const initialRanks_ = await getInitialRanks();
      const newPlayersData = Object.values(initialRanks_).filter(
        (p) => !!p.timestamp
      );
      const parsed = groupChangesByDate(logs_, newPlayersData);
      setGroupedChanges(parsed);
      setLoading(false);
    })();
    return () => {
      setLoading(true);
    };
  }, []);

  if (loading) {
    return (
      <Box className="mainsection-panel mainsection-graph-panel">
        <Typography variant="h6" fontWeight={500}>
          Loading Patch Notes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="mainsection-panel mainsection-graph-panel"
      sx={{
        paddingRight: "18px !important",
      }}
    >
      <Typography variant="h6" fontWeight={500} className="patch-notes-title">
        Patch Notes
      </Typography>
      <Box className="patch-notes-scroll-container">
        {groupedChanges && Object.keys(groupedChanges).length > 0 ? (
          Object.entries(groupedChanges)
            .filter(([date, changes]) => changes.length > 0)
            .map(([date, changes]) => (
              <Card key={date} className="patch-notes-day-card">
                <CardContent>
                  <Typography
                    variant="body2"
                    className="patch-notes-date-title"
                  >
                    {formatDate(date)}
                  </Typography>
                  <Box className="patch-notes-changes-container">
                    {changes.map((change) => {
                      if (change.type === "new_player") {
                        return (
                          <Box
                            key={change.changeId}
                            className="patch-notes-change-item"
                          >
                            <Chip
                              label="NEW"
                              size="small"
                              variant="filled"
                              className="patch-notes-role-chip"
                            />
                            <Typography
                              component={Link}
                              to={`/player/${change.name_id}`}
                              variant="body2"
                              className="patch-notes-player-name"
                            >
                              {change.name || change.player || change.name_id}
                            </Typography>
                            <Chip
                              component={Link}
                              to={`/player/${change.name_id}`}
                              label="Player joined"
                              size="small"
                              variant="filled"
                              className="patch-notes-rank-chip"
                              sx={{
                                cursor: "pointer",
                              }}
                            />
                          </Box>
                        );
                      } else {
                        const rankInfo = getRankChangeInfo(
                          change.oldRank,
                          change.newRank
                        );
                        return (
                          <Box
                            key={change.changeId}
                            className="patch-notes-change-item"
                          >
                            <Chip
                              label={change.role.toUpperCase()}
                              size="small"
                              variant="filled"
                              className="patch-notes-role-chip"
                            />
                            <Typography
                              component={Link}
                              to={`/player/${change.name_id}`}
                              variant="body2"
                              className="patch-notes-player-name"
                            >
                              {change.player}
                            </Typography>
                            <Chip
                              label={`${rankInfo.direction} ${change.oldRank} → ${change.newRank}`}
                              size="small"
                              color={rankInfo.color}
                              className="patch-notes-rank-chip"
                            />
                          </Box>
                        );
                      }
                    })}
                  </Box>
                </CardContent>
              </Card>
            ))
        ) : (
          <Box className="patch-notes-empty-state">
            <Typography variant="body2">No rank changes found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PatchNotes;
