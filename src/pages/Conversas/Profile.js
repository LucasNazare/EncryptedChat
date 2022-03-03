import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

export default function Profile({ open, user, close, logoutVisible }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  return (
    <Dialog open={open}>
      <DialogTitle>
        <div style={{ margin: "0", fontWeight: "300", fontSize: "1.5rem" }}>
          Username:
        </div>
        {user.username}
        {logoutVisible && (
          <Button
            color="primary"
            variant="outlined"
            fullWidth
            style={{
              fontFamily: "'VT323'",
              fontSize: "1rem",
              marginBottom: "5px",
            }}
            onClick={() => navigate("/change-password")}
          >
            Trocar Senha
          </Button>
        )}
        {logoutVisible && (
          <Button
            color="secondary"
            variant="outlined"
            fullWidth
            style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
            onClick={logout}
          >
            Sair
          </Button>
        )}
      </DialogTitle>
      <DialogContent style={{ fontFamily: "'VT323'" }}>
        <div style={{ margin: "0", fontWeight: "300", fontSize: "1.5rem" }}>
          ID:
        </div>
        <div
          style={{ wordWrap: "break-word", margin: "0", fontFamily: "cursive" }}
        >
          {user._id}
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
            navigator.clipboard.writeText(user._id);
            alert("Copiado para a área de transferência.");
            close();
          }}
        >
          Copiar ID
        </Button>
      </DialogActions>
    </Dialog>
  );
}
