import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import logo from "../../assets/imgs/logo.png";
import bg from "../../assets/imgs/bg.jpg";
import { useNavigate } from "react-router-dom";
import CustomChip from "../../components/CustomChip/CustomChip";
import Navbar from "../../layouts/Navbar";
import SelectUserIdModal from "./SelectUserIdModal";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
const CryptoJS = require("crypto-js");

const labelStyle = { margin: "0px" };
const textFieldStyle = { background: "white" };

export default function NewChat({ socket }) {
  const { token, user, logout, k, K_SECRET, IV } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [apagarConversa, setApagarConversa] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [participants, setParticipants] = useState([
    { id: user._id, username: user.username },
  ]);

  const handleDeleteParticipant = (id) => {
    if (id !== user._id) {
      let newArr = [...participants];
      let index = newArr.findIndex((p) => p._id === id);
      if (index > -1) {
        newArr.splice(index, 1);
        setParticipants(newArr);
      } else {
        console.log(index, newArr);
      }
    }
  };

  const addParticipant = async (id) => {
    if (!id) return alert("Digite uma ID de usuário");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let res = await axios.get(
        "https://saferabbit.tk/api/accounts/" + id,
        config
      );
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
        let groupK = nomeGrupo + String(Date.now()) + k + K_SECRET;
        //let encK = CryptoJS.AES.encrypt(groupK, k).toString();
        let res = await axios.post(
          "https://saferabbit.tk/api/chats/create",
          {
            name: nomeGrupo,
            participants: participants,
            apagarConversaEm: apagarConversa,
            k,
            iv: IV,
          },
          config
        );
        if (res.data) {
          socket.emit("createChat");
          navigate("/");
        } else {
          alert(res.data.msg);
        }
      } catch (e) {
        console.log(e.response?.data);
      }
    } else {
      alert("Preencha todos os campos.");
    }
  };
  return (
    <Grid
      container
      alignItems={"flex-start"}
      justifyContent={"center"}
      style={{ background: "#fd6000" }}
    >
      <Grid item xs={12} style={{ height: "13vh" }}>
        <Navbar title="Nova Conversa" backUrl={"/"} />
      </Grid>
      <Grid item xs={12} style={{ height: "87vh", overflowY: "auto" }}>
        <form onSubmit={submit}>
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
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Adicionar Participante
                  </Button>
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
                              btnCallback={() => handleDeleteParticipant(p.id)}
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
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                    style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
                  >
                    Criar Conversa
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <SelectUserIdModal
        open={isModalOpen}
        close={() => setIsModalOpen(false)}
        send={addParticipant}
      />
    </Grid>
  );
}
