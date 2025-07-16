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
import { useTranslation } from "react-i18next";

export default function RequestButton({ open, setOpen, requestToBeNerd }) {
  const { t } = useTranslation();
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
        {t("navbar.requestPermission")}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("auth.requestPermissionDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("auth.requestPermissionDialog.description")}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={t("common.name")}
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("common.cancel")}</Button>
          <Button onClick={handleSend}>{t("common.send")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
