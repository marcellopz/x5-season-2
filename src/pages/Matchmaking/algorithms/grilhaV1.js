const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];
const maxAttempts = 1000;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function evaluateMatch(pairings, tolerance) {
  for (let i = 0; i < roles.length; i++) {
    const [p1, p2] = pairings[i];
    const rank1 = p1.ranks[i];
    const rank2 = p2.ranks[i];
    if (Math.abs(rank1 - rank2) > tolerance) return false;
  }
  return true;
}

function generateSingleMatch(players, tolerance, laneCounts, maxLanePerPlayer) {
  const available = [...players];
  shuffle(available);

  const match = [];
  for (let i = 0; i < roles.length; i++) {
    // const role = roles[i];
    let p1 = null,
      p2 = null;

    for (let a = 0; a < available.length; a++) {
      if ((laneCounts[available[a].playerId]?.[i] || 0) < maxLanePerPlayer) {
        p1 = available.splice(a, 1)[0];
        break;
      }
    }

    for (let b = 0; b < available.length; b++) {
      if ((laneCounts[available[b].playerId]?.[i] || 0) < maxLanePerPlayer) {
        p2 = available.splice(b, 1)[0];
        break;
      }
    }

    if (!p1 || !p2) return null;

    match.push([p1, p2]);
  }

  if (!evaluateMatch(match, tolerance)) return null;

  for (let i = 0; i < roles.length; i++) {
    const [p1, p2] = match[i];
    laneCounts[p1.playerId] = laneCounts[p1.playerId] || Array(5).fill(0);
    laneCounts[p2.playerId] = laneCounts[p2.playerId] || Array(5).fill(0);
    laneCounts[p1.playerId][i]++;
    laneCounts[p2.playerId][i]++;
  }

  return match;
}

/**
 * Transforms a match from the old format to the new format
 * @param {Array} match - Match in old format (array of pairs)
 * @returns {Object} - Match in new format
 */
function transformMatchToNewFormat(match) {
  // Create flat pairings array
  const pairings = [];
  const pairingsRoles = {};
  let blueTeamScore = 0;
  let redTeamScore = 0;

  // Add all players to pairings and populate pairingsRoles
  for (let i = 0; i < roles.length; i++) {
    const [p1, p2] = match[i];

    // Add to flat pairings array
    pairings.push(p1, p2);

    // Add to pairingsRoles object
    pairingsRoles[roles[i]] = [
      {
        name: p1.name,
        rank: p1.ranks[i],
      },
      {
        name: p2.name,
        rank: p2.ranks[i],
      },
    ];

    // Calculate scores
    blueTeamScore += p1.ranks[i];
    redTeamScore += p2.ranks[i];
  }

  return {
    pairingsRoles,
    matchScore: {
      blue: blueTeamScore,
      red: redTeamScore,
    },
    pairings,
  };
}

function generateMatches(players, totalMatches, tolerance) {
  const oldFormatResults = [];
  const laneCounts = {};
  let maxLanePerPlayer = 1;

  while (maxLanePerPlayer <= 5) {
    for (
      let attempt = 0;
      attempt < maxAttempts && oldFormatResults.length < totalMatches;
      attempt++
    ) {
      const match = generateSingleMatch(
        players,
        tolerance,
        laneCounts,
        maxLanePerPlayer
      );
      if (match) oldFormatResults.push(match);
    }

    if (oldFormatResults.length === totalMatches) break;
    maxLanePerPlayer++;
  }

  // Transform to new format
  const newFormatResults = oldFormatResults.map(transformMatchToNewFormat);

  return newFormatResults;
}

export default generateMatches;

// function printMatches(matches) {
//   matches.forEach((match, idx) => {
//     let score1 = 0;
//     let score2 = 0;
//     console.log(`Match ${idx + 1}:`);
//     for (let i = 0; i < roles.length; i++) {
//       const [p1, p2] = match[i];
//       const r1 = p1.ranks[i];
//       const r2 = p2.ranks[i];
//       score1 += r1;
//       score2 += r2;
//       console.log(`${roles[i]}:  ${p1.name} (${r1}) x (${r2}) ${p2.name}`);
//     }
//     console.log(`Score: ${score1} x ${score2} -> ${score1 + score2}\n`);
//   });
// }

// const players = [
//   { id: 0, name: "Andrey", ranks: [7, 8, 7, 6, 9], playerId: "andrey" },
//   { id: 1, name: "Ari", ranks: [2, 3, 1, 2, 2], playerId: "ari" },
//   { id: 2, name: "Bigode", ranks: [9, 7, 9, 8, 8], playerId: "bigode" },
//   { id: 3, name: "Carioca", ranks: [4, 4, 5, 5, 6], playerId: "carioca" },
//   { id: 4, name: "Danilo", ranks: [8, 8, 7, 5, 10], playerId: "danilo" },
//   { id: 5, name: "Grilha", ranks: [9, 8, 8, 7, 5], playerId: "grilha" },
//   { id: 6, name: "Lacerda", ranks: [8, 8, 7, 7, 7], playerId: "lacerda" },
//   { id: 7, name: "Luca", ranks: [4, 2, 4, 6, 2], playerId: "luca" },
//   { id: 8, name: "Lyra", ranks: [9, 7, 8, 9, 9], playerId: "lyra" },
//   { id: 9, name: "Marcello", ranks: [9, 7, 5, 10, 5], playerId: "marcello" },
//   { id: 10, name: "Mesquita", ranks: [10, 8, 8, 9, 7], playerId: "mesquita" },
//   { id: 11,  name: "Nascido", ranks: [3, 3, 1, 2, 1], playerId: "nascido" },
//   { id: 12,  name: "Pedro Ruim", ranks: [8, 7, 7, 9, 7], playerId: "pedro" },
//   { id: 13,  name: "Pedro Gay", ranks: [4, 3, 4, 4, 6], playerId: "pedro_gay" },
//   { id: 14,  name: "Reinaldo", ranks: [5, 6, 5, 7, 8], playerId: "reinaldo" },
//   { id: 15,  name: "Talita", ranks: [1, 1, 3, 3, 6], playerId: "talita" },
//   { id: 16,  name: "Valbim", ranks: [8, 8, 6, 9, 9], playerId: "valber" },
//   { id: 17,  name: "Vinicim", ranks: [8, 7, 7, 10, 5], playerId: "vinicim" },
//   { id: 18,  name: "Xibiu", ranks: [4, 3, 2, 1, 3], playerId: "xibiu" },
//   { id: 19,  name: "Zé", ranks: [9, 9, 8, 9, 10], playerId: "ze" }
// ];

// function runBalanceByIds(ids, allPlayers, totalMatches = 5, tolerance = 1) {
//   if (ids.length !== 10) {
//     console.error("Erro: Exatamente 10 IDs devem ser fornecidos.");
//     return;
//   }

//   const selectedPlayers = ids.map(id => {
//     const player = allPlayers.find(p => p.id === id);
//     if (!player) {
//       throw new Error(`Jogador com ID ${id} não encontrado.`);
//     }
//     return player;
//   });

//   const matches = generateMatches(selectedPlayers, totalMatches, tolerance);
//   printMatches(matches);
// }

// Gere e imprima
// const selected = players.slice(0, 10); // ou selecione manualmente

// if (selected.length !== 10) {
//   console.error("Erro: O balanceamento exige exatamente 10 jogadores.");
//   process.exit(1); // ou return, se estiver no navegador
// }
// const matches = generateMatches(selected, 5, 1);
// printMatches(matches);

// const ids = [0, 3, 4, 5, 8, 9, 2, 7, 6, 1]; // qualquer 10 válidos
// runBalanceByIds(ids, players);
