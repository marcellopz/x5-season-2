import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { capitalizeFirstLetter } from "../../../utils/utils";
import {
  setPlayer,
  addPlayerPhoto,
  setInitialRank,
} from "../../../services/firebaseDatabase";

export default function AddPlayerDialog({ open, onClose }) {
  const [fields, setFields] = useState({
    top: 1,
    jungle: 1,
    mid: 1,
    adc: 1,
    support: 1,
    accountId: 0,
    name: "",
    name_id: "",
  });
  const [photoB64, setPhotoB64] = useState("");

  const fieldChange = (fname) => (e) => {
    setFields((prev) => ({ ...prev, [fname]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form submission logic here
    if (fields.accountId) {
      fields.accountId = +fields.accountId;
    }
    await setInitialRank(fields);
    await setPlayer(fields);
    if (photoB64) {
      await addPlayerPhoto(photoB64, fields.name.toLocaleLowerCase());
    }
  };

  return (
    <Dialog
      onClose={() => {
        setFields({
          top: 1,
          jungle: 1,
          mid: 1,
          adc: 1,
          support: 1,
          accountId: 0,
          name: "",
        });
        setPhotoB64("");
        onClose();
      }}
      open={open}
    >
      <DialogTitle>Add player</DialogTitle>
      <DialogContent style={{ margin: "20px", display: "block" }}>
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
            label="name_id"
            value={fields.name_id}
            onChange={fieldChange("name_id")}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Account ID"
            type="number"
            value={fields.accountId}
            onChange={fieldChange("accountId")}
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

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
