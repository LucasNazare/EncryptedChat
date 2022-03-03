import { Button, Dialog, DialogActions } from "@mui/material";
import React from "react";

export default function ImagePreview({ image, setImage, send }) {
  const close = () => setImage(null);
  const sendAndClose = async () => {
    await send();
    close();
  };
  return (
    <Dialog open={image !== null}>
      <img src={image?.preview ? image.preview : ""} />
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          fullWidth
          style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
          onClick={close}
        >
          Voltar
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
