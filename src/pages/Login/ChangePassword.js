import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import logo from "../../assets/imgs/logo.png";
import bg from "../../assets/imgs/bg.jpg";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import Navbar from "../../layouts/Navbar";

const labelStyle = { margin: "0px" };
const textFieldStyle = { background: "white" };
export default function ChangePassword() {
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
            "https://saferabbit.tk/api/accounts/change-password",
            {
              password,
            },
            config
          );
          navigate("/");
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
  return (
    <>
      <div style={{ height: "13vh" }}>
        <Navbar title="Alterar Senha" backUrl={"/"} />
      </div>
      <div style={{ background: "#fd6000", height: "87vh", overflowY: "auto" }}>
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
              <Typography variant={"h1"}>Escolha sua Senha</Typography>
              <Typography
                variant={"h6"}
                style={{
                  color: "white",
                  background: "rgba(0,0,0,50%)",
                  padding: "5px",
                }}
              >
                Além de ser usada para acessar o aplicativo, sua Senha é uma
                parte da chave para descriptografar suas conversas. Garantindo
                que só você consiga descriptografa-las. Isso implica que ao
                trocar de senha, suas conversas serão perdidas.
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
                    Nova Senha
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
                    Confirmar Senha
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
    </>
  );
}
