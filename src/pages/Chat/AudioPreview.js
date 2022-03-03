import { Button, Dialog, DialogActions } from "@mui/material";
import React from "react";

export default function ImagePreview({ audioURL, setAudioURL, send }) {
  const close = () => setAudioURL("");
  const sendAndClose = async () => {
    await send();
    close();
  };
  return (
    <Dialog open={audioURL !== ""}>
      <audio src={audioURL} controls style={{ width: "100%" }} />
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          fullWidth
          style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
          onClick={close}
        >
          Cancelar
        </Button>
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
          onClick={sendAndClose}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
