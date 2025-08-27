import BalanceMatchCheezeV1 from "../algorithms/cheezeV1";
import BalanceMatchCheezeV2 from "../algorithms/cheezeV2";
import BalanceMatchClaudeV1 from "../algorithms/claudeV1";
import BalanceMatchGrilhaV1 from "../algorithms/grilhaV1";

// Function to decide which lanes to flip before balancing
const decideLanesToFlip = (presetPositions) => {
  const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];

  // Track which lanes have preset matchups that can be flipped
  const presetsToFlip = [];
  roles.forEach((role) => {
    const preset = presetPositions[role];
    if (preset && (preset[0] !== "" || preset[1] !== "")) {
      presetsToFlip.push(role);
    }
  });

  // If no preset lanes to flip, return empty array
  if (presetsToFlip.length === 0) {
    return [];
  }

  // Randomly select some preset lanes to flip sides (each lane independently)
  const lanesToFlip = presetsToFlip.filter(() => Math.random() < 0.5);

  // If no lanes are selected for flipping, force at least one to be flipped
  if (lanesToFlip.length === 0 && presetsToFlip.length > 0) {
    lanesToFlip.push(
      presetsToFlip[Math.floor(Math.random() * presetsToFlip.length)]
    );
  }

  return lanesToFlip;
};

// Function to generate modified presetPositions with flipped sides
const generateFlippedPresetPositions = (
  originalPresetPositions,
  lanesToFlip
) => {
  const flippedPresetPositions = { ...originalPresetPositions };

  lanesToFlip.forEach((role) => {
    const originalPreset = originalPresetPositions[role];
    if (
      originalPreset &&
      (originalPreset[0] !== "" || originalPreset[1] !== "")
    ) {
      // Flip the sides for this lane
      flippedPresetPositions[role] = [originalPreset[1], originalPreset[0]];
    }
  });

  return flippedPresetPositions;
};

export const executeBalance = (
  playersToBalance,
  algoOptions,
  selectedAlgo,
  callbacks
) => {
  const { setIsLoading, setError, setMatchups } = callbacks;

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
      // Apply half support rank if the option is enabled
      let modifiedPlayersToBalance = playersToBalance;
      if (algoOptions?.useHalfSupportRank) {
        modifiedPlayersToBalance = playersToBalance.map((player) => {
          if (
            player &&
            player.ranks &&
            Array.isArray(player.ranks) &&
            player.ranks.length >= 5
          ) {
            const newRanks = [...player.ranks];
            newRanks[4] = Math.floor(player.ranks[4] / 2) || 1;
            return {
              ...player,
              ranks: newRanks,
            };
          }
          return player;
        });
      }

      const targetMatches = +algoOptions.options.numberOfMatches;
      const hasPresetLanes = Object.values(
        algoOptions.presetPositions || {}
      ).some((lane) => lane[0] !== "" || lane[1] !== "");
      const shouldRandomizeSides = algoOptions.randomizeSides && hasPresetLanes;

      // If we're randomizing sides, generate variations with different flipped lanes
      if (shouldRandomizeSides) {
        // Try to generate matches with different side flip configurations
        while (i++ < MAX_TRIES) {
          // Decide which lanes to flip for this iteration
          const lanesToFlip = decideLanesToFlip(algoOptions.presetPositions);

          // Generate modified preset positions with flipped sides
          const modifiedPresetPositions = generateFlippedPresetPositions(
            algoOptions.presetPositions,
            lanesToFlip
          );

          // Generate match with the modified preset positions
          a = BalanceMatchCheezeV2(
            modifiedPlayersToBalance,
            algoOptions.options.tolerance,
            modifiedPresetPositions
          );

          if (a === null) {
            continue;
          }

          stringA = JSON.stringify(a.pairings);
          if (matchupsString.includes(stringA)) {
            continue;
          }

          matchupsString.push(stringA);
          matchups_.push(a);

          if (matchups_.length >= targetMatches) {
            break;
          }
        }
      } else {
        // Original behavior - no side randomization
        while (i++ < MAX_TRIES) {
          a = BalanceMatchCheezeV2(
            modifiedPlayersToBalance,
            algoOptions.options.tolerance,
            algoOptions.presetPositions
          );
          if (a === null) {
            continue;
          }

          stringA = JSON.stringify(a.pairings);
          if (matchupsString.includes(stringA)) {
            continue;
          }
          matchupsString.push(stringA);
          matchups_.push(a);

          if (matchups_.length >= targetMatches) {
            break;
          }
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
};
