import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/imgs/logo.png";
import bg from "../../assets/imgs/bg.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
const CryptoJS = require("crypto-js");

const labelStyle = { margin: "0px" };
const textFieldStyle = { background: "white" };
export default function Login() {
  const { setToken, setUser, K_SECRET, IV, setK } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if ((username != "", password != "")) {
      try {
        let res = await axios.post("http://18.230.11.27/api/accounts/login", {
          username,
          password,
        });
        if (res.data.ok) {
          const k = CryptoJS.SHA256(
            username +
              password +
              String(new Date(res.data.user.createdAt).getTime()) +
              K_SECRET
          );
          setK(
            CryptoJS.AES.encrypt(k, CryptoJS.enc.Hex.parse(K_SECRET), {
              iv: CryptoJS.enc.Hex.parse(IV),
            }).toString()
          );
          setUser(res.data.user);
          setToken(res.data.token);
        } else {
          alert(res.data.msg);
        }
      } catch (e) {
        console.log(e.response?.data);
        alert(e.response?.data);
      }
    } else {
      alert("Preencha todos os campos.");
    }
  };

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
            <img src={logo} style={{ maxWidth: "250px", maxHeight: "250px" }} />
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
                  Usuario
                </Typography>
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  style={textFieldStyle}
                  value={username}
                  inputProps={{
                    style: {
                      fontFamily: "'VT323'",
                      fontSize: "1.3rem",
                    },
                  }}
                  onChange={(e) => setUsername(e.target.value)}
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
                  Senha
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
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
