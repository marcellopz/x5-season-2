import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { capitalizeFirstLetter } from "../../../utils/utils";
import {
  setPlayer,
  addPlayerPhoto,
  addRankChangeLog,
} from "../../../services/firebaseDatabase";

export default function EditPlayerForm({ player, reloadPlayers, goBack }) {
  const [fields, setFields] = useState(player);
  const [photoB64, setPhotoB64] = useState("");

  const fieldChange = (fname) => (e) => {
    setFields((prev) => ({ ...prev, [fname]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form submission logic here
    if (fields.account_id) {
      fields.account_id = +fields.account_id;
    }
    setPlayer(fields)
      .then(() => {
        // Create logs for rank changes
        const roles = ["top", "jungle", "mid", "adc", "support"];
        const changes = roles
          .filter((role) => player[role] !== fields[role])
          .map((role) => ({
            player: fields.name,
            name_id: player.name_id,
            role,
            oldRank: player[role],
            newRank: fields[role],
            timestamp: Date.now(),
            type: "rank_change",
          }));
        return Promise.all(
          changes.map((change) => addRankChangeLog(player.name_id, change))
        );
      })
      .then(() => {
        reloadPlayers();
        alert("Player updated");
      });
    if (photoB64) {
      await addPlayerPhoto(photoB64, fields.name.toLocaleLowerCase());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={fields.name}
        onChange={fieldChange("name")}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Account ID"
        type="number"
        value={fields.account_id}
        onChange={fieldChange("account_id")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="PhotoB64"
        value={photoB64}
        onChange={(e) => setPhotoB64(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            label="Hide Player"
            name="hide"
            checked={fields.hide || false}
            onChange={(e) => {
              setFields((prev) => ({ ...prev, hide: e.target.checked }));
            }}
            style={{ margin: "20px" }}
          />
        }
        label="Hide Player"
      />

      {["top", "jungle", "mid", "adc", "support"].map((role) => (
        <FormControl fullWidth margin="normal" key={role}>
          <FormLabel component="legend">
            {capitalizeFirstLetter(role)}
          </FormLabel>
          <Select value={fields[role]} onChange={fieldChange(role)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <MenuItem value={n} key={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={goBack}
        style={{ margin: "20px 20px 0 0" }}
      >
        Back
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px" }}
      >
        Submit
      </Button>
    </form>
  );
}
