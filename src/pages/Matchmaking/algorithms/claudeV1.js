export default function BalanceMatchClaudeV1(players, numberOfMatches = 1) {
  // Check if we have exactly 10 players
  if (players.length !== 10) {
    return null;
  }

  // Calculate average rank for each player
  players.forEach((player) => {
    player.avgRank =
      player.ranks.reduce((sum, rank) => sum + rank, 0) / player.ranks.length;
  });

  // Sort players by average rank (highest to lowest)
  const sortedPlayers = [...players].sort((a, b) => b.avgRank - a.avgRank);

  // Function to calculate team sum
  const getTeamSum = (team) =>
    team.reduce((sum, player) => sum + player.avgRank, 0);

  // Find multiple team compositions
  function findMultipleTeamCompositions() {
    // Store multiple team compositions
    const teamCompositions = [];

    // Generate all possible combinations of 5 players
    // using bitmask to represent different combinations
    const totalPlayers = sortedPlayers.length;
    const totalCombinations = 1 << totalPlayers;

    // For tracking which combinations we've already seen
    const seenCombinations = new Set();

    for (let mask = 0; mask < totalCombinations; mask++) {
      // Check if the current mask has exactly 5 bits set (5 players selected)
      const bits = mask.toString(2).split("1").length - 1;
      if (bits !== 5) continue;

      const blueTeam = [];
      const redTeam = [];

      // Assign players based on the bitmask
      for (let i = 0; i < totalPlayers; i++) {
        if ((mask & (1 << i)) !== 0) {
          blueTeam.push(sortedPlayers[i]);
        } else {
          redTeam.push(sortedPlayers[i]);
        }
      }

      // Calculate team sums and difference
      const blueSum = getTeamSum(blueTeam);
      const redSum = getTeamSum(redTeam);
      const diff = Math.abs(blueSum - redSum);

      // Create a key for this composition
      const compositionKey =
        JSON.stringify(blueTeam.map((p) => p.name).sort()) +
        JSON.stringify(redTeam.map((p) => p.name).sort());

      // Skip if we've already seen this composition (just different order)
      if (seenCombinations.has(compositionKey)) continue;
      seenCombinations.add(compositionKey);

      // Add this composition to our results
      teamCompositions.push({
        blueTeam: [...blueTeam],
        redTeam: [...redTeam],
        difference: diff,
        blueSum,
        redSum,
      });

      // If we have a perfect match (diff = 0), we'll still collect it but keep looking for others
    }

    // Sort compositions by difference (most balanced first)
    teamCompositions.sort((a, b) => a.difference - b.difference);

    // Return the requested number of compositions (or all if fewer are available)
    return teamCompositions.slice(0, numberOfMatches);
  }

  // Get multiple team compositions
  const teamCompositions = findMultipleTeamCompositions();

  // Format the results for each composition
  return teamCompositions.map((composition) => {
    const { blueTeam, redTeam, difference, blueSum, redSum } = composition;

    return {
      matchScore: {
        blue: blueSum,
        red: redSum,
      },
      difference: difference,
      teams: {
        blue: blueTeam.map((player) => ({
          name: player.name,
          avgRank: player.avgRank,
        })),
        red: redTeam.map((player) => ({
          name: player.name,
          avgRank: player.avgRank,
        })),
      },
      blueTeam,
      redTeam,
    };
  });
}
