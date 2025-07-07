import React, { useContext, useEffect, useState, useCallback } from "react";
import BalanceMatchCheezeV1 from "../algorithms/cheezeV1";
import BalanceMatchCheezeV2 from "../algorithms/cheezeV2";
import BalanceMatchClaudeV1 from "../algorithms/claudeV1";
import BalanceMatchGrilhaV1 from "../algorithms/grilhaV1";
import { MatchMakingContext } from "../context/matchMakingContext";
import { Button, IconButton, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { theme } from "../../../theme";

const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];

const buildLine = (matchup) => {
  return `${matchup[0].name.padStart(10, " ")} (${matchup[0].rank}) x (${
    matchup[1].rank
  }) ${matchup[1].name}`;
};

const getCopyPasteText = (matchups) => {
  let string = "";
  matchups.forEach((match, i) => {
    string += `Match ${i + 1}:\n`;

    // Check if it's claudeV1 algorithm result
    if (match.teams) {
      // Sort teams by average rank for better readability
      const sortedBlueTeam = [...match.teams.blue].sort(
        (a, b) => b.avgRank - a.avgRank
      );
      const sortedRedTeam = [...match.teams.red].sort(
        (a, b) => b.avgRank - a.avgRank
      );

      // For claudeV1, show player list with average ranks
      for (let j = 0; j < 5; j++) {
        const bluePlayer = sortedBlueTeam[j];
        const redPlayer = sortedRedTeam[j];
        string += `${j + 1 + ":"} ${bluePlayer.name.padStart(
          10,
          " "
        )} (${bluePlayer.avgRank.toFixed(1)}) x (${redPlayer.avgRank.toFixed(
          1
        )}) ${redPlayer.name}\n`;
      }
      string += `Score: ${match.matchScore.blue.toFixed(
        1
      )} x ${match.matchScore.red.toFixed(1)} -> ${(
        match.matchScore.blue + match.matchScore.red
      ).toFixed(1)}\n`;
      string += `Difference: ${Math.abs(
        match.matchScore.blue - match.matchScore.red
      ).toFixed(1)}\n\n`;
    } else {
      // Original format for cheezeV1 and cheezeV2
      string += `Top: ${buildLine(match.pairingsRoles.Top)}\n`;
      string += `Jng: ${buildLine(match.pairingsRoles.Jungle)}\n`;
      string += `Mid: ${buildLine(match.pairingsRoles.Mid)}\n`;
      string += `Adc: ${buildLine(match.pairingsRoles.Adc)}\n`;
      string += `Sup: ${buildLine(match.pairingsRoles.Support)}\n`;
      string += `Score: ${match.matchScore.blue} x ${match.matchScore.red} -> ${
        match.matchScore.blue + match.matchScore.red
      }\n\n`;
    }
  });

  return string;
};

// Function to generate side-flipped version of matches for preset lanes
const generateSideFlippedMatch = (originalMatch, presetPositions) => {
  const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];
  const flippedPairingsRoles = {};
  const flippedMatchScore = { blue: 0, red: 0 };
  const flippedPairings = [...originalMatch.pairings];

  // Track which lanes have preset matchups that should be flipped
  const presetsToFlip = [];
  roles.forEach((role, roleIndex) => {
    const preset = presetPositions[role];
    if (preset && preset[0] !== "" && preset[1] !== "") {
      presetsToFlip.push(roleIndex);
    }
  });

  // If no preset lanes to flip, return null
  if (presetsToFlip.length === 0) {
    return null;
  }

  // Randomly select some preset lanes to flip sides
  const lanesToFlip = presetsToFlip.filter(() => Math.random() < 0.5);

  // If no lanes are selected for flipping, force at least one to be flipped
  if (lanesToFlip.length === 0 && presetsToFlip.length > 0) {
    lanesToFlip.push(
      presetsToFlip[Math.floor(Math.random() * presetsToFlip.length)]
    );
  }

  // Generate the flipped version
  for (let i = 0; i < 5; i++) {
    const roleIndex = i;
    const p0Index = i * 2;
    const p1Index = i * 2 + 1;

    let p0 = originalMatch.pairings[p0Index];
    let p1 = originalMatch.pairings[p1Index];

    // If this lane should be flipped, swap the players
    if (lanesToFlip.includes(roleIndex)) {
      [p0, p1] = [p1, p0];
      flippedPairings[p0Index] = p0;
      flippedPairings[p1Index] = p1;
    }

    flippedPairingsRoles[roles[i]] = [
      { name: p0.name, rank: p0.ranks[i] },
      { name: p1.name, rank: p1.ranks[i] },
    ];

    flippedMatchScore.blue += p0.ranks[i];
    flippedMatchScore.red += p1.ranks[i];
  }

  return {
    pairingsRoles: flippedPairingsRoles,
    matchScore: flippedMatchScore,
    pairings: flippedPairings,
  };
};

const ResultComponent = ({ match }) => {
  // Check if the match is using claudeV1 algorithm (has teams property)
  const isClaudeV1 = match.teams !== undefined;

  if (isClaudeV1) {
    // For claudeV1, display by average rank rather than roles
    // Sort blue and red teams by average rank (highest to lowest)
    const sortedBlueTeam = [...match.teams.blue].sort(
      (a, b) => b.avgRank - a.avgRank
    );
    const sortedRedTeam = [...match.teams.red].sort(
      (a, b) => b.avgRank - a.avgRank
    );

    return (
      <div style={{ height: "fit-content" }}>
        <ul style={{ margin: "10px", listStyle: "none", padding: 0 }}>
          {sortedBlueTeam.map((bluePlayer, i) => {
            const redPlayer = sortedRedTeam[i];
            return (
              <li
                key={i}
                style={{
                  display: "flex",
                  backgroundColor:
                    i % 2 === 0
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.3)",
                  padding: "5px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    textAlign: "end",
                    marginRight: "10px",
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    width: "100px",
                    textAlign: "end",
                    marginRight: "5px",
                  }}
                >
                  {bluePlayer.name}
                </div>
                <div
                  style={{ marginRight: "10px", width: "32px" }}
                >{`(${bluePlayer.avgRank.toFixed(1)})`}</div>
                <div>vs</div>
                <div
                  style={{ marginLeft: "10px" }}
                >{`(${redPlayer.avgRank.toFixed(1)})`}</div>
                <div style={{ width: "100px", marginLeft: "5px" }}>
                  {redPlayer.name}
                </div>
              </li>
            );
          })}
          <li
            style={{
              display: "flex",
              backgroundColor: theme.palette.secondary.main,
              padding: "5px 10px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                width: "50px",
                textAlign: "end",
                marginRight: "10px",
              }}
            >
              Scores
            </div>
            <div
              style={{
                width: "130px",
                textAlign: "end",
                marginRight: "10px",
              }}
            >
              {match.matchScore.blue.toFixed(1)}
            </div>
            <div>-</div>
            <div style={{ width: "130px", marginLeft: "10px" }}>
              {match.matchScore.red.toFixed(1)}
            </div>
          </li>
          <li
            style={{
              display: "flex",
              backgroundColor: theme.palette.secondary.dark,
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          >
            <div
              style={{
                width: "50px",
                textAlign: "end",
                marginRight: "10px",
              }}
            >
              Total
            </div>
            <div
              style={{
                width: "290px",
                textAlign: "center",
              }}
            >
              {(match.matchScore.blue + match.matchScore.red).toFixed(1)}
            </div>
          </li>
          <li
            style={{
              display: "flex",
              backgroundColor: theme.palette.secondary.main,
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          >
            <div
              style={{
                width: "50px",
                textAlign: "end",
                marginRight: "10px",
              }}
            >
              Diff
            </div>
            <div
              style={{
                width: "290px",
                textAlign: "center",
              }}
            >
              {Math.abs(match.matchScore.blue - match.matchScore.red).toFixed(
                1
              )}
            </div>
          </li>
        </ul>
      </div>
    );
  }

  // Original layout for cheezeV1 and cheezeV2
  return (
    <div style={{ height: "fit-content" }}>
      <ul style={{ margin: "10px", listStyle: "none", padding: 0 }}>
        {roles.map((role, i) => {
          return (
            <li
              key={i}
              style={{
                display: "flex",
                backgroundColor:
                  i % 2 === 0
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.3)",
                padding: "5px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  textAlign: "end",
                  marginRight: "10px",
                }}
              >
                {role}
              </div>
              <div
                style={{
                  width: "100px",
                  textAlign: "end",
                  marginRight: "5px",
                }}
              >
                {match.pairingsRoles[role][0].name}
              </div>
              <div
                style={{ marginRight: "10px", width: "20px" }}
              >{`(${match.pairingsRoles[role][0].rank})`}</div>
              <div>vs</div>
              <div
                style={{ marginLeft: "10px" }}
              >{`(${match.pairingsRoles[role][1].rank})`}</div>
              <div style={{ width: "100px", marginLeft: "5px" }}>
                {match.pairingsRoles[role][1].name}
              </div>
            </li>
          );
        })}
        <li
          style={{
            display: "flex",
            backgroundColor: theme.palette.secondary.main,
            padding: "5px 10px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              width: "50px",
              textAlign: "end",
              marginRight: "10px",
            }}
          >
            Scores
          </div>
          <div
            style={{
              width: "130px",
              textAlign: "end",
              marginRight: "10px",
            }}
          >
            {match.matchScore.blue}
          </div>
          <div>-</div>
          <div style={{ width: "130px", marginLeft: "10px" }}>
            {match.matchScore.red}
          </div>
        </li>
        <li
          style={{
            display: "flex",
            backgroundColor: theme.palette.secondary.dark,
            paddingTop: "5px",
            paddingBottom: "5px",
          }}
        >
          <div
            style={{
              width: "50px",
              textAlign: "end",
              marginRight: "10px",
            }}
          >
            Total
          </div>
          <div
            style={{
              width: "290px",
              textAlign: "center",
            }}
          >
            {match.matchScore.blue + match.matchScore.red}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default function ResultStep() {
  const {
    players,
    algoOptions,
    selectedOptions,
    selectedAlgo,
    wildcardDetails,
  } = useContext(MatchMakingContext);
  const [playersToBalance, setPlayersToBalance] = useState(null);
  const [matchups, setMatchups] = useState([]);
  const [copyPastText, setCopyPasteText] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const balance = useCallback(() => {
    if (!playersToBalance) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setMatchups([]);

    const MAX_TRIES = +algoOptions?.options?.numberOfMatches * 10;
    let matchupsString = [];
    let matchups_ = [];
    let i = 0;
    let a;
    let stringA;

    try {
      if (selectedAlgo === "cheezeV1") {
        while (i++ < MAX_TRIES) {
          a = BalanceMatchCheezeV1(playersToBalance);
          if (!a || !a.pairings) {
            continue;
          }
          stringA = JSON.stringify(a.pairings);
          if (matchupsString.includes(stringA)) {
            continue;
          }
          matchupsString.push(stringA);
          matchups_.push(a);
          if (matchups_.length === +algoOptions.options.numberOfMatches) {
            break;
          }
        }

        if (matchups_.length === 0) {
          setError(
            "No valid matches could be generated with the current players and settings. Try adjusting your tolerance or player selection."
          );
        } else {
          setMatchups(matchups_);
        }
      }

      if (selectedAlgo === "cheezeV2") {
        const targetMatches = +algoOptions.options.numberOfMatches;
        const hasPresetLanes = Object.values(
          algoOptions.presetPositions || {}
        ).some((lane) => lane[0] !== "" || lane[1] !== "");
        const shouldRandomizeSides =
          algoOptions.randomizeSides && hasPresetLanes;

        while (i++ < MAX_TRIES) {
          a = BalanceMatchCheezeV2(
            playersToBalance,
            algoOptions.options.tolerance,
            algoOptions.presetPositions
          );
          if (a === null) {
            continue;
          }

          // If randomizing sides and we have preset lanes, generate side variations
          if (shouldRandomizeSides) {
            // Generate original match
            stringA = JSON.stringify(a.pairings);
            if (!matchupsString.includes(stringA)) {
              matchupsString.push(stringA);
              matchups_.push(a);
            }

            // Generate side-flipped version
            const flippedMatch = generateSideFlippedMatch(
              a,
              algoOptions.presetPositions
            );
            if (flippedMatch) {
              const flippedStringA = JSON.stringify(flippedMatch.pairings);
              if (!matchupsString.includes(flippedStringA)) {
                matchupsString.push(flippedStringA);
                matchups_.push(flippedMatch);
              }
            }
          } else {
            // Original behavior - no side randomization
            stringA = JSON.stringify(a.pairings);
            if (matchupsString.includes(stringA)) {
              continue;
            }
            matchupsString.push(stringA);
            matchups_.push(a);
          }

          if (matchups_.length >= targetMatches) {
            break;
          }
        }

        if (matchups_.length === 0) {
          setError(
            "No valid matches could be generated with the current tolerance and preset positions. Try increasing the tolerance or adjusting your preset lane assignments."
          );
        } else {
          setMatchups(matchups_);
        }
      }

      if (selectedAlgo === "claudeV1") {
        // The claudeV1 algorithm now directly returns multiple team compositions
        const result = BalanceMatchClaudeV1(
          playersToBalance,
          +algoOptions.options.numberOfMatches
        );
        if (result === null || !result || result.length === 0) {
          setError(
            "No valid team compositions could be generated. Make sure you have an even number of players (minimum 10) and try again."
          );
        } else {
          setMatchups(result);
        }
      }

      if (selectedAlgo === "grilhaV1") {
        const result = BalanceMatchGrilhaV1(
          playersToBalance,
          +algoOptions.options.numberOfMatches,
          algoOptions.options.tolerance
        );
        if (result === null || !result || result.length === 0) {
          setError(
            "No valid matches could be generated with the current tolerance setting. Try increasing the tolerance or adjusting your player selection."
          );
        } else {
          setMatchups(result);
        }
      }
    } catch (err) {
      console.error("Error generating matches:", err);
      setError(
        "An unexpected error occurred while generating matches. Please try again with different settings."
      );
    } finally {
      setIsLoading(false);
    }
  }, [playersToBalance, algoOptions, selectedAlgo]);

  useEffect(() => {
    setPlayersToBalance([
      ...selectedOptions.map((player) => ({
        name: players[player].name,
        ranks: [
          players[player].top,
          players[player].jungle,
          players[player].mid,
          players[player].adc,
          players[player].support,
        ],
        playerId: player,
      })),
      ...wildcardDetails.map((player) => ({
        name: player.name,
        ranks: [
          player.top,
          player.jungle,
          player.mid,
          player.adc,
          player.support,
        ],
        playerId: player.name,
      })),
    ]);
  }, [selectedOptions, players]);

  useEffect(() => {
    if (playersToBalance?.length) {
      balance();
    }
  }, [playersToBalance, balance]);

  useEffect(() => {
    if (matchups && matchups.length > 0) {
      setCopyPasteText(getCopyPasteText(matchups));
    }
  }, [matchups]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "20px auto" }}>
          <Button
            variant="outlined"
            onClick={() => balance(playersToBalance)}
            sx={{ margin: "20px" }}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Reroll (rebola)"}
          </Button>
          {matchups && matchups.length > 0 && (
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(copyPastText);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px",
            padding: "20px",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            border: "1px solid rgba(255, 0, 0, 0.3)",
            borderRadius: "8px",
          }}
        >
          <div style={{ textAlign: "center", color: "#ff6b6b" }}>
            <h3>No Matches Found</h3>
            <p>{error}</p>
            <p style={{ fontSize: "0.9em", marginTop: "10px" }}>
              Suggestions:
              <br />
              • Try increasing the tolerance value
              <br />
              • Remove or adjust preset lane assignments
              <br />
              • Select different players
              <br />• Try a different algorithm
            </p>
          </div>
        </div>
      )}

      {matchups && matchups.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {matchups.map((match, i) => (
              <ResultComponent key={i} match={match} />
            ))}
          </div>
          <TextField
            value={copyPastText}
            multiline
            // height="100%"
            sx={{
              margin: "10px",
              minWidth: "400px",
              color: "gray",
              height: "inherit",
            }}
            inputProps={{
              sx: {
                fontFamily: '"Lucida Console", "Courier New", monospace',
                height: "-webkit-fill-available",
                justifyContent: "start",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
