import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function RequestButton({ open, setOpen, requestToBeNerd }) {
  const [name, setName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSend = () => {
    requestToBeNerd(name);
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        className="navbar-request-button"
      >
        Request permission
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Request permission to see photos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To get the full experience of this website, request permission to
            see photos. Inform a name for us to identify you and if you're
            accepted in you'll be granted access to all the website
            functionalities.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
