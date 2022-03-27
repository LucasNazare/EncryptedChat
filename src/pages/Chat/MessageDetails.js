import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function MessageDetails({
  selectedMsg,
  close,
  msg,
  socket,
  chat,
  setChat,
}) {
  const { logout, token, user } = useContext(AuthContext);

  const submitDelete = async () => {
    if (!selectedMsg) return;
    let arr = [...chat];
    let index = arr.findIndex((m) => m._id === selectedMsg._id);
    if (index === -1) return;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let chatRes = await axios.post(
        "https://saferabbit.tk/api/messages/delete",
        { msgId: selectedMsg._id },
        config
      );
      socket.emit("sendMessage", selectedMsg, token);
      arr.splice(index, 1);
      setChat(arr);
      close();
    } catch (e) {
      console.log(e);
      console.log(e.response?.data);
    }
  };

  if (!selectedMsg) return <div></div>;
  return (
    <Dialog open={selectedMsg}>
      <DialogContent style={{ fontFamily: "'VT323'" }}>
        <div style={{ margin: "0", fontWeight: "300", fontSize: "1.5rem" }}>
          Mensagem:
        </div>
        <br />
        <div
          style={{ wordWrap: "break-word", margin: "0", fontFamily: "cursive" }}
        >
          {msg}
        </div>
        <br />
        <div>
          {user?._id === selectedMsg.senderId && (
            <Button
              variant="contained"
              fullWidth
              style={{
                fontFamily: "'VT323'",
                fontSize: "1rem",
                background: "#bf2f24",
              }}
              onClick={submitDelete}
            >
              Deletar Mensagem
            </Button>
          )}
        </div>
      </DialogContent>
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
          onClick={() => {
            navigator.clipboard.writeText(msg);
            alert("Copiado para a área de transferência.");
            close();
          }}
        >
          Copiar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
