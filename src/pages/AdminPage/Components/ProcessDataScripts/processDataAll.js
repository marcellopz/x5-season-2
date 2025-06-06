import { championIds as champIds } from "../../../../common-components/resources";

export const processPlayerPairs = (matches) => {
  const pairs = {};
  Object.values(matches).forEach((match) => {
    const winnerTeam = match.teams.filter((t) => t.win === "Win")[0].teamId;
    match.participants.forEach((p1) => {
      let p1id = p1.summonerId;
      if (!pairs.hasOwnProperty(p1id)) {
        pairs[p1id] = {};
      }
      match.participants.forEach((p2) => {
        let p2id = p2.summonerId;
        if (p1id === p2id) {
          return;
        }
        if (!pairs[p1id].hasOwnProperty(p2id)) {
          pairs[p1id][p2id] = {
            same_team: { wins: 0, games: 0 },
            opposite_team: { wins: 0, games: 0 },
          };
        }
        if (p1.teamId === p2.teamId) {
          pairs[p1id][p2id].same_team.games += 1;
          pairs[p1id][p2id].same_team.wins += p1.teamId === winnerTeam;
        } else {
          pairs[p1id][p2id].opposite_team.games += 1;
          pairs[p1id][p2id].opposite_team.wins += p1.teamId === winnerTeam;
        }
      });
    });
  });

  return pairs;
};

export default function processDataAll(matches) {
  let gameDurationTotal = 0;
  const blueSide = {
    baronKills: 0,
    dragonKills: 0,
    firstBaron: 0,
    firstBlood: 0,
    firstDragon: 0,
    firstInhibitor: 0,
    firstTower: 0,
    riftHeraldKills: 0,
    towerKills: 0,
    wins: 0,
  };
  const redSide = {
    baronKills: 0,
    dragonKills: 0,
    firstBaron: 0,
    firstBlood: 0,
    firstDragon: 0,
    firstInhibitor: 0,
    firstTower: 0,
    riftHeraldKills: 0,
    towerKills: 0,
    wins: 0,
  };

  const championIds = Object.keys(champIds);
  const champions = {};
  championIds.forEach(
    (id) =>
      (champions[id] = {
        championId: id,
        championName: champIds[id],
        picks: 0,
        bans: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        creepsKilled: 0,
      })
  );
  const gamesPerMonth = {};
  // Initialize weekDayDistribution object to track games by day of week
  const weekDayDistribution = {
    0: 0, // Sunday
    1: 0, // Monday
    2: 0, // Tuesday
    3: 0, // Wednesday
    4: 0, // Thursday
    5: 0, // Friday
    6: 0, // Saturday
  };
  // Initialize game duration histogram (grouped in 3-minute intervals)
  const gameDurationHistogram = {};
  // Initialize hourly distribution to track games by hour of day (0-23)
  const hourlyDistribution = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
  };
  let earliestDate = null;
  let latestDate = null;

  Object.values(matches).forEach((match) => {
    gameDurationTotal += match.gameDuration;

    // Update game duration histogram (group in 3-minute intervals)
    // Convert seconds to minutes and find the 3-minute interval
    const durationMinutes = Math.floor(match.gameDuration / 60);
    const intervalKey = Math.floor(durationMinutes / 3) * 3;
    const intervalLabel = `${intervalKey}-${intervalKey + 3}`;
    gameDurationHistogram[intervalLabel] =
      (gameDurationHistogram[intervalLabel] || 0) + 1;

    match.participants.forEach((p) => {
      champions[p.championId].picks += 1;
      champions[p.championId].wins += p.stats.win;
      champions[p.championId].kills += p.stats.kills;
      champions[p.championId].deaths += p.stats.deaths;
      champions[p.championId].assists += p.stats.assists;
      champions[p.championId].creepsKilled += p.stats.totalCs;
    });
    const blue = match.teams.filter((t) => t.teamId === 100)[0];
    blueSide.baronKills += blue.baronKills;
    blueSide.dragonKills += blue.dragonKills;
    blueSide.firstBlood += blue.firstBlood;
    blueSide.firstBaron += blue.firstBaron;
    blueSide.firstDragon += blue.firstDargon;
    blueSide.firstTower += blue.firstTower;
    blueSide.firstInhibitor += blue.firstInhibitor;
    blueSide.riftHeraldKills += blue.riftHeraldKills;
    blueSide.towerKills += blue.towerKills;
    blueSide.wins += blue.win === "Win";
    blue.bans?.forEach((b) => {
      champions[b.championId].bans += 1;
    });

    const red = match.teams.filter((t) => t.teamId === 200)[0];
    redSide.baronKills += red.baronKills;
    redSide.dragonKills += red.dragonKills;
    redSide.firstBlood += red.firstBlood;
    redSide.firstBaron += red.firstBaron;
    redSide.firstDragon += red.firstDargon;
    redSide.firstTower += red.firstTower;
    redSide.firstInhibitor += red.firstInhibitor;
    redSide.riftHeraldKills += red.riftHeraldKills;
    redSide.towerKills += red.towerKills;
    redSide.wins += red.win === "Win";
    red.bans?.forEach((b) => {
      champions[b.championId].bans += 1;
    });

    const gameDateString = match?.date;

    if (gameDateString) {
      try {
        const date = new Date(gameDateString);

        // Check if the date is valid
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // getMonth() is 0-indexed
          const monthYear = `${year}-${month.toString().padStart(2, "0")}`; // Format as YYYY-MM

          gamesPerMonth[monthYear] = (gamesPerMonth[monthYear] || 0) + 1;

          // Update earliest and latest date (using timestamps for comparison)
          if (!earliestDate || date.getTime() < earliestDate.getTime()) {
            earliestDate = date;
          }
          if (!latestDate || date.getTime() > latestDate.getTime()) {
            latestDate = date;
          }

          // Update the weekday distribution
          const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
          weekDayDistribution[dayOfWeek] += 1;

          // Update the hourly distribution
          const hourOfDay = date.getHours(); // 0-23
          hourlyDistribution[hourOfDay] += 1;
        } else {
          console.error(
            `Invalid date string for match ${match.gameId}: ${gameDateString}`
          );
        }
      } catch (error) {
        console.error(
          `Error processing date for match ${match.gameId}: ${gameDateString}`,
          error
        );
      }
    } else {
      console.error(
        `No gameCreationDate for match ${match.gameId} - ${match.gameDateString}`
      );
    }
  });

  // Fill in missing months and add padding
  const paddedGamesPerMonth = {};

  if (
    earliestDate &&
    latestDate &&
    !isNaN(earliestDate.getTime()) &&
    !isNaN(latestDate.getTime())
  ) {
    // Get the year and month of the earliest and latest months
    const earliestYear = earliestDate.getFullYear();
    const earliestMonthIndex = earliestDate.getMonth(); // 0-indexed

    const latestYear = latestDate.getFullYear();
    const latestMonthIndex = latestDate.getMonth(); // 0-indexed

    let startYear = earliestYear;
    let startMonthIndex = earliestMonthIndex - 1;
    if (startMonthIndex < 0) {
      startYear--;
      startMonthIndex = 11; // December
    }

    let endYear = latestYear;
    let endMonthIndex = latestMonthIndex + 1;
    if (endMonthIndex > 11) {
      endYear++;
      endMonthIndex = 0; // January
    }

    let currentYear = startYear;
    let currentMonthIndex = startMonthIndex;

    // Iterate through all months in the padded range
    while (
      currentYear < endYear ||
      (currentYear === endYear && currentMonthIndex <= endMonthIndex)
    ) {
      const monthYear = `${currentYear}-${(currentMonthIndex + 1)
        .toString()
        .padStart(2, "0")}`;

      // Use the count from gamesPerMonth, default to 0 if missing
      paddedGamesPerMonth[monthYear] = gamesPerMonth[monthYear] || 0;

      // Move to the next month
      currentMonthIndex++;
      if (currentMonthIndex > 11) {
        currentYear++;
        currentMonthIndex = 0;
      }
    }
  } else {
    console.error("No valid dates found for padding.");
  }

  // Sort game duration histogram keys numerically
  const sortedGameDurationHistogram = {};
  Object.keys(gameDurationHistogram)
    .map((key) => {
      // Extract the first number from the interval (e.g., "6-9" becomes 6)
      return parseInt(key.split("-")[0]);
    })
    .sort((a, b) => a - b)
    .forEach((intervalStart) => {
      const key = `${intervalStart}-${intervalStart + 3}`;
      sortedGameDurationHistogram[key] = gameDurationHistogram[key];
    });

  return {
    gamesPerMonth: paddedGamesPerMonth,
    blueSide,
    redSide,
    champions,
    gameDurationTotal,
    numberOfGames: Object.keys(matches).length,
    weekDayDistribution, // Include the weekday distribution in the return value
    gameDurationHistogram: sortedGameDurationHistogram, // Include sorted game duration histogram
    hourlyDistribution, // Include games played per hour of day
  };
}
