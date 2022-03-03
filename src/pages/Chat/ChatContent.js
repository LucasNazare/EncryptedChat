import { Grid } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import ChatMessage from "./ChatMessage";
const CryptoJS = require("crypto-js");

export default function ChatContent({ token, chat, chatData, scrollRef }) {
  const navigate = useNavigate();
  const { user, IV, kMap } = useContext(AuthContext);
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
    //get audios
  }, []);

  const decrypt = (msg) => {
    let k = kMap.find((m) => m.id === chatData._id)?.k;
    if (msg.type === "TEXT") {
      let decrypted = CryptoJS.AES.decrypt(
        msg.content,
        CryptoJS.enc.Hex.parse(k),
        {
          iv: CryptoJS.enc.Hex.parse(chatData._id + IV),
        }
      );
      decrypted = decrypted.toString(CryptoJS.enc.Utf8);
      return decrypted;
    }
    if (msg.type === "AUDIO") {
      // let blob = new Blob([audios.find((m) => m._id === msg._id)?.buffer], {
      //   type: "audio/wav",
      // });
      // let url = URL.createObjectURL(blob);
      return msg.content;
    }
    if (msg.type === "IMAGE") {
      return msg.content;
    }
  };

  return (
    <div
      style={{
        paddingTop: "10px",
        marginRight: "2vw",
        marginLeft: "2vw",
        //overflowX: "hidden",
        //wordWrap: "break-word",
        // wordBreak: "normal",
        // overflowWrap: "normal",
      }}
    >
      <Grid container alignItems={"center"} justifyContent={"center"}>
        {chat?.map((message, i) => {
          return (
            <Grid item xs={12} key={message._id}>
              <div ref={scrollRef}>
                <ChatMessage
                  k={kMap.find((m) => m.id === chatData._id)?.k}
                  msg={decrypt(message)}
                  type={message.type}
                  sent={message.senderId === user._id}
                  last={chat.length - 1 === i}
                  senderId={message.senderId}
                  senderName={
                    chatData?.participants?.find(
                      (p) => p.id === message.senderId
                    )?.username
                  }
                  time={
                    new Date(message.createdAt)
                      .toTimeString()
                      .split(" ")[0]
                      .split(":")[0] +
                    ":" +
                    new Date(message.createdAt)
                      .toTimeString()
                      .split(" ")[0]
                      .split(":")[1]
                  }
                />
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
