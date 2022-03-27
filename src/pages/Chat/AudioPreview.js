import { Button, Dialog, DialogActions } from "@mui/material";
import React, { useState } from "react";

export default function ImagePreview({ audioURL, setAudioURL, send }) {
  const [loading, setLoading] = useState(false);
  const close = () => setAudioURL("");
  const sendAndClose = async () => {
    setLoading(true);
    await send();
    setLoading(false);
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
          disabled={loading}
          style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
          onClick={sendAndClose}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
