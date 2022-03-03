import React, { useContext } from "react";
import { Badge, Divider, Grid, Typography } from "@mui/material";

import logo from "../../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
const CryptoJS = require("crypto-js");

function ConversaItem(item, key, navigate, userId, k, IV) {
  const decrypt = (msg) => {
    let decrypted = CryptoJS.AES.decrypt(msg, CryptoJS.enc.Hex.parse(k), {
      iv: CryptoJS.enc.Hex.parse(item._id + IV),
    });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
  };
  return (
    <Grid
      item
      xs={12}
      style={{
        width: "100%",
        background: item.notReadMsgs === 0 ? "#fff1e8" : "#efd4ff",
        cursor: "pointer",
      }}
      key={item._id}
      onClick={() => navigate("/chat/" + item._id)}
    >
      <Grid
        container
        alignItems={"center"}
        justifyContent={"flex-start"}
        style={{
          height: "100%",
          paddingLeft: "5px",
          paddingRight: "5px",
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >
        <Grid item xs={2} style={{ height: "100%" }}>
          <Badge
            badgeContent={
              item.participants?.find((p) => p.id === userId)?.unread
            }
            overlap="circular"
            color="secondary"
          >
            <img
              src={item.photoUrl ? item.photoUrl : logo}
              style={{ width: "50px" }}
            />
          </Badge>
        </Grid>
        <Grid item xs={8} style={{ height: "100%", paddingLeft: "5px" }}>
          <Typography variant="h2">{item.name}</Typography>
          <Typography variant="body2">
            {item?.lastMsg?.type === "TEXT"
              ? String(decrypt(item.lastMsg.content)).substring(0, 30) +
                (item.lastMsg.content.length > 30 ? "..." : "")
              : item?.lastMsg?.type === "AUDIO"
              ? "Arquivo de Áudio"
              : item?.lastMsg?.type === "IMAGE"
              ? "Imagem"
              : "Conversa iniciada"}
          </Typography>
        </Grid>

        <Grid item xs={2} style={{ height: "100%", textAlign: "right" }}>
          <Typography variant="caption">
            {item.lastMsg
              ? new Date(item.lastMsg.createdAt)
                  .toTimeString()
                  .split(" ")[0]
                  .split(":")[0] +
                ":" +
                new Date(item.lastMsg.createdAt)
                  .toTimeString()
                  .split(" ")[0]
                  .split(":")[1]
              : new Date(item.createdAt)
                  .toTimeString()
                  .split(" ")[0]
                  .split(":")[0] +
                ":" +
                new Date(item.createdAt)
                  .toTimeString()
                  .split(" ")[0]
                  .split(":")[1]}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
}
export default function Content({ chats, kMap }) {
  const navigate = useNavigate();
  const { user, k, IV } = useContext(AuthContext);
  return (
    <div style={{ height: "100%", background: "#fff9f5" }}>
      <Grid container alignItems={"center"} justifyContent={"center"}>
        {chats &&
          chats.map((item, i) => {
            return ConversaItem(
              item,
              i,
              navigate,
              user._id,
              kMap.find((m) => m.id === item._id)?.k,
              IV
            );
          })}
        {chats?.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontFamily: "'VT323'",
            }}
          >
            <h1
              style={{
                color: "lightgray",
                fontWeight: "300",
                fontSize: "3rem",
              }}
            >
              Sem Conversas Ativas
            </h1>
          </div>
        ) : (
          <></>
        )}
      </Grid>
    </div>
  );
}
