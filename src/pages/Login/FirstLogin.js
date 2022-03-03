import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import logo from "../../assets/imgs/logo.png";
import bg from "../../assets/imgs/bg.jpg";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const labelStyle = { margin: "0px" };
const textFieldStyle = { background: "white" };
export default function FirstLogin() {
  const { token, user, setToken, setUser, logout } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if ((cPassword !== "", password !== "")) {
      if (cPassword === password) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        try {
          let res = await axios.post(
            "http://18.230.11.27/api/accounts/change-sos-password",
            {
              sosPassword: password,
            },
            config
          );
          setUser({ ...user, firstLogin: false });
        } catch (e) {
          console.log(e.response?.data);
          if (e.response?.data?.ok === false) {
            alert(e.response.data.msg);
            logout();
          }
        }
      } else {
        alert("Preencha todos os campos.");
      }
    } else {
      alert("As senhas devem ser iguais.");
    }
  };
  if (!user.firstLogin) return <Navigate to="/" />;
  return (
    <div style={{ background: "#fd6000", height: "100vh", overflowY: "auto" }}>
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
            <Typography variant={"h1"}>
              Escolha sua Senha de Segurança
            </Typography>
            <Typography
              variant={"h6"}
              style={{
                color: "white",
                background: "rgba(0,0,0,50%)",
                padding: "5px",
              }}
            >
              A Senha de Segurança é uma Senha para momentos de emergência. Ao
              inseri-la na tentativa de Login, o Safe Rabbit apagará todas as
              conversas e a conta será bloqueada até o Login padrão acontecer de
              novo.
            </Typography>
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
                  Senha de Segurança
                </Typography>
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  style={textFieldStyle}
                  value={cPassword}
                  type={"password"}
                  autoComplete="off"
                  inputProps={{
                    style: {
                      fontFamily: "'VT323'",
                      fontSize: "1.3rem",
                    },
                  }}
                  onChange={(e) => {
                    setCPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={10} style={{ paddingTop: "20px" }}>
                <Typography variant="h1" style={labelStyle}>
                  Confirmar Senha de Segurança
                </Typography>
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  style={textFieldStyle}
                  value={password}
                  type={"password"}
                  autoComplete="off"
                  inputProps={{
                    style: {
                      fontFamily: "'VT323'",
                      fontSize: "1.3rem",
                    },
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={10} style={{ paddingTop: "20px" }}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  style={{ fontFamily: "'VT323'", fontSize: "1rem" }}
                >
                  Continuar Para o App
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
