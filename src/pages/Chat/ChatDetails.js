import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CustomChip from "../../components/CustomChip/CustomChip";
import axios from "axios";
import logo from "../../assets/imgs/logo.png";
import bg from "../../assets/imgs/bg.jpg";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import SelectUserIdModal from "../NewChat/SelectUserIdModal";

const labelStyle = { margin: "0px" };
const textFieldStyle = { background: "white" };
export default function ChatDetails({
  open,
  close,
  canEdit,
  chatData,
  setChatData,
}) {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nomeGrupo, setNomeGrupo] = useState(chatData.name);
  const [apagarConversa, setApagarConversa] = useState(
    chatData.apagarConversaEm
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participants, setParticipants] = useState([...chatData.participants]);

  const handleDeleteParticipant = (id) => {
    if (id !== user._id) {
      let newArr = [...participants];
      let index = newArr.findIndex((p) => p.id === id);
      if (index > -1) {
        newArr.splice(index, 1);
        setParticipants(newArr);
      } else {
        console.log(index, newArr);
      }
    }
  };

  const addParticipant = async (id) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let res = await axios.get("http://localhost/api/accounts/" + id, config);
      if (res.data) {
        let arr = [...participants];
        let newItem = { id: res.data._id, username: res.data.username };
        if (arr.findIndex((item) => item.id === res.data._id) === -1) {
          arr.push(newItem);
          setParticipants(arr);
        } else {
          alert("Usuario ja esta na lista.");
        }
      } else {
        alert("ID de usuario invalida.");
      }
    } catch (e) {
      alert("Erro de conexao.");
      console.log(e.response?.data);
      logout();
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    if ((nomeGrupo != "", participants.length > 0)) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      try {
        let res = await axios.post(
          "http://localhost/api/chats/edit",
          {
            chatId: chatData._id,
            name: nomeGrupo,
            participants: participants,
            apagarConversaEm: apagarConversa,
          },
          config
        );
        close();
        navigate("/");
      } catch (e) {
        console.log(e.response?.data);
        console.log("errror");
      }
    } else {
      alert("Preencha todos os campos.");
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent style={{ fontFamily: "'VT323'" }}>
        <form>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            style={{ background: `url(${bg}) repeat`, backgroundSize: "500px" }}
          >
            <Grid
              item
              xs={12}
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                textAlign: "center",
                background: "rgba(73, 0, 115, .7)",
              }}
            >
              <img
                src={logo}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                background: "#fd6000",
              }}
            >
              <Grid
                container
                alignItems={"center"}
                justifyContent={"center"}
                style={{ textAlign: "left" }}
              >
                <Grid item xs={10} style={{ paddingTop: "20px" }}>
                  <Typography variant="h1" style={labelStyle}>
                    Nome da Conversa
                  </Typography>
                  <TextField
                    color="primary"
                    variant="outlined"
                    fullWidth
                    style={textFieldStyle}
                    disabled={!canEdit}
                    value={nomeGrupo}
                    type={"text"}
                    autoComplete="off"
                    inputProps={{
                      style: {
                        fontFamily: "'VT323'",
                        fontSize: "1.3rem",
                      },
                    }}
                    onChange={(e) => setNomeGrupo(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                alignItems={"center"}
                justifyContent={"center"}
                style={{ textAlign: "left" }}
              >
                <Grid item xs={10} style={{ paddingTop: "20px" }}>
                  <Typography variant="h1" style={labelStyle}>
                    Apagar a conversa
                  </Typography>
                  <Select
                    style={textFieldStyle}
                    fullWidth
                    value={apagarConversa}
                    disabled={!canEdit}
                    onChange={(e) => setApagarConversa(e.target.value)}
                  >
                    <MenuItem value={1}>
                      <Typography variant="h6">A cada 1 hora</Typography>
                    </MenuItem>
                    <MenuItem value={3}>
                      <Typography variant="h6">A cada 3 horas</Typography>
                    </MenuItem>
                    <MenuItem value={6}>
                      <Typography variant="h6">A cada 6 horas</Typography>
                    </MenuItem>
                    <MenuItem value={12}>
                      <Typography variant="h6">A cada 12 horas</Typography>
                    </MenuItem>
                    <MenuItem value={24}>
                      <Typography variant="h6">A cada 1 dia</Typography>
                    </MenuItem>
                    <MenuItem value={168}>
                      <Typography variant="h6">A cada 7 dias</Typography>
                    </MenuItem>
                    <MenuItem value={720}>
                      <Typography variant="h6">A cada 30 dias</Typography>
                    </MenuItem>
                    <MenuItem value={-1}>
                      <Typography variant="h6">Nunca</Typography>
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={10} style={{ paddingTop: "20px" }}>
                  <Typography variant="h1" style={labelStyle}>
                    Participantes
                  </Typography>
                  {canEdit && (
                    <Button
                      color="primary"
                      variant="outlined"
                      fullWidth
                      style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Adicionar Participante
                    </Button>
                  )}
                </Grid>
                <Grid item xs={10} style={{ marginTop: "10px" }}>
                  <Grid
                    container
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {participants &&
                      participants.map((p) => {
                        return (
                          <Grid item xs={12} key={p.id}>
                            <CustomChip
                              _id={p._id}
                              text={p.username}
                              color="#490073"
                              textColor={"#ffffff"}
                              btnCallback={
                                canEdit
                                  ? () => handleDeleteParticipant(p.id)
                                  : null
                              }
                            />
                          </Grid>
                        );
                      })}
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={10}
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}
                >
                  {canEdit && (
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      type="submit"
                      onClick={submit}
                      style={{
                        fontFamily: "'VT323'",
                        fontSize: "1rem",
                        marginBottom: "5px",
                      }}
                    >
                      Salvar
                    </Button>
                  )}
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
                    onClick={close}
                  >
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions></DialogActions>
      <SelectUserIdModal
        open={isModalOpen}
        close={() => setIsModalOpen(false)}
        send={addParticipant}
      />
    </Dialog>
  );
}
