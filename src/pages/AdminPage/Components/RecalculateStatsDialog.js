import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import {
  getMatchRoles,
  getMatches,
  getMatchesByPlayer,
  saveOverallStats,
  savePlayerPairs,
  savePlayerStats,
} from "../../../services/firebaseDatabase";
import processDataPlayer from "./ProcessDataScripts/processDataPlayer";
import processDataAll, {
  processPlayerPairs,
} from "./ProcessDataScripts/processDataAll";

const RecalculateStats = async () => {
  const matchRoles = await getMatchRoles();
  const players = await getMatchesByPlayer();
  const playerIds = Object.keys(players);
  const processedDataPerPlayer = playerIds.map((playerId) =>
    processDataPlayer(players[playerId].matches, matchRoles)
  );
  processedDataPerPlayer.forEach(async (player) => {
    await savePlayerStats(player);
  });

  const allMatches = await getMatches();
  const processedDataAll = processDataAll(allMatches);

  await saveOverallStats(processedDataAll);

  const processedPairs = processPlayerPairs(allMatches);
  await savePlayerPairs(processedPairs);

  alert("stats saved");
};

export default function RecalculateStatsDialog({ open, onClose }) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Recalculate Stats</DialogTitle>
      <DialogContent style={{ margin: "20px" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={RecalculateStats}
        >
          Recalculate stats
        </Button>
      </DialogContent>
    </Dialog>
  );
}
