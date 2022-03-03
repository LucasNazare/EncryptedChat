import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function SelectUserIdModal({ open, close, send }) {
  const [participantId, setParticipantId] = useState("");
  const labelStyle = { margin: "0px" };
  const textFieldStyle = { background: "white" };

  const resetAndClose = () => {
    setParticipantId("");
    close();
  };

  const resetAndSend = () => {
    setParticipantId("");
    send(participantId);
    close();
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Digite a ID do participante</DialogTitle>
      <DialogContent>
        <TextField
          color="primary"
          variant="outlined"
          fullWidth
          style={textFieldStyle}
          value={participantId}
          multiline
          minRows={4}
          maxRows={4}
          type={"text"}
          autoComplete="off"
          inputProps={{
            style: {
              fontFamily: "'VT323'",
              fontSize: "1.3rem",
            },
          }}
          onChange={(e) => setParticipantId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
          onClick={resetAndSend}
        >
          Adicionar
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          fullWidth
          style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
          onClick={resetAndClose}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
