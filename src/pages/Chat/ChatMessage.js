import { Typography } from "@mui/material";
import React, { useState } from "react";
import Profile from "../Conversas/Profile";
import MessageDetails from "./MessageDetails";

export default function ChatMessage({
  msgObj,
  msg,
  time,
  senderName,
  senderId,
  sent,
  last,
  type,
  k,
  socket,
  chat,
  setChat,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const messageBoxStyle = {
    background: sent ? "#490073" : "#fd6000",
    maxWidth: "80vw",
    minWidth: "40vw",
    paddingTop: "5px",
    paddingBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    color: "#ffffff",
    borderRadius: sent ? "0px 10px" : "10px 0px",
    marginBottom: last ? "40px" : "10px",
    float: sent ? "right" : "left",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
    // overflow: "hidden",
    // wordWrap: "break-word",
  };
  const timeStyle = { fontSize: ".6rem", position: "absolute", right: 0 };
  if (true)
    return (
      <div style={messageBoxStyle} key={msg + time + senderName}>
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <Typography
            variant="caption"
            style={{ fontWeight: "800", cursor: "pointer" }}
            onClick={() => setProfileOpen(true)}
          >
            {senderName}
          </Typography>
          <Typography variant="caption" style={timeStyle}>
            {time}
          </Typography>
        </div>
        <div>
          {type === "TEXT" && (
            <Typography
              variant="body2"
              style={{
                overflow: "hidden",
                wordWrap: "break-word",
                cursor: "pointer",
              }}
              onClick={() => setSelectedMsg(msgObj)}
            >
              {msg}
            </Typography>
          )}
          {type === "AUDIO" && k && (
            <audio
              src={
                String(msg).substring(0, 4) === "blob"
                  ? msg
                  : "https://saferabbit.tk/api/messages/stream-audio/" +
                    msg +
                    "/" +
                    k
              }
              controls
              style={{
                width: "70vw",
                maxWidth: "300px",
              }}
            />
          )}
          {type === "IMAGE" && k && (
            <img
              src={
                String(msg).substring(0, 4) === "blob"
                  ? msg
                  : "https://saferabbit.tk/api/messages/stream-image/" +
                    msg +
                    "/" +
                    k
              }
              style={{
                width: "70vw",
                maxWidth: "300px",
              }}
            />
          )}
        </div>
        <div style={{ textAlign: "right" }}></div>
        <Profile
          open={profileOpen}
          close={() => setProfileOpen(false)}
          user={{ _id: senderId, username: senderName }}
        />
        <MessageDetails
          selectedMsg={selectedMsg}
          msg={msg}
          close={() => setSelectedMsg(null)}
          socket={socket}
          chat={chat}
          setChat={setChat}
        />
      </div>
    );
}
