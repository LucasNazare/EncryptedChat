import { Button, Fab, Grid, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import AudioPreview from "./AudioPreview";
import StopIcon from "@mui/icons-material/Stop";
const CryptoJS = require("crypto-js");

export default function SendForm({
  chat,
  chatData,
  setChat,
  socket,
  sendFilesOpen,
  setSendFilesOpen,
  audioURL,
  setAudioURL,
  isRecording,
  startRecording,
  stopRecording,
  recordingTime,
  setRecordingTime,
  audioBlob,
  setAudioBlob,
  selectedImage,
  setSelectedImage,
}) {
  const { token, user, logout, IV, kMap } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (messageText) {
      let k = kMap.find((m) => m.id === chatData._id)?.k;
      if (!k) navigate("/");
      else {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        try {
          let encM = CryptoJS.AES.encrypt(
            messageText,
            CryptoJS.enc.Hex.parse(k),
            {
              iv: CryptoJS.enc.Hex.parse(chatData._id + IV),
            }
          ).toString();
          let res = await axios.post(
            "http://18.230.11.27/api/messages/send",
            {
              type: "TEXT",
              chatId: chatData._id,
              content: encM,
            },
            config
          );
          if (res.data) {
            let arr = [...chat];
            arr.push(res.data);
            setChat(arr);
            socket.emit("sendMessage", res.data, token);
            setMessageText("");
          } else {
            alert(res.data.msg);
          }
        } catch (e) {
          console.log(e);
          console.log(e.response?.data);
          logout();
        }
      }
    }
  };
  const submitAudio = async () => {
    let k = kMap.find((m) => m.id === chatData._id)?.k;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const file = new File([audioBlob], chatData._id + ".wav");
      const formData = new FormData();
      formData.append("chatId", chatData._id);
      formData.append("k", k);
      formData.append("iv", chatData._id + IV);
      formData.append("audio", file);
      let res = await axios.post(
        "http://18.230.11.27/api/messages/send-audio",
        formData,
        config
      );
      if (res.data) {
        let msgRes = await axios.post(
          "http://18.230.11.27/api/messages/send",
          {
            type: "AUDIO",
            chatId: chatData._id,
            content: res.data.filename,
          },
          config
        );

        if (msgRes.data) {
          let arr = [...chat];
          let newAudio = { ...msgRes.data, content: audioURL };
          arr.push(newAudio);
          setChat(arr);

          socket.emit("sendMessage", msgRes.data, token);
          setMessageText("");
          setAudioURL("");
          setAudioBlob(null);
        }
      }
    } catch (e) {
      console.log(e);
      console.log(e.response?.data);
    }
  };

  return (
    <form style={{ paddingTop: "1px" }} onSubmit={submit}>
      <AudioPreview
        audioURL={audioURL}
        setAudioURL={setAudioURL}
        send={submitAudio}
      />
      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={9} style={{ textAlign: "center" }}>
          {!isRecording && (
            <TextField
              color="primary"
              autoFocus
              variant="outlined"
              fullWidth
              type={"text"}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ background: "#fff7f2" }}
              autoComplete="off"
            />
          )}
          {isRecording && (
            <p>
              Gravando a{" "}
              {recordingTime > 60
                ? parseInt(recordingTime / 60) +
                  "m" +
                  (parseInt(
                    recordingTime - Math.floor(recordingTime / 60) * 60
                  ) > 9
                    ? parseInt(
                        recordingTime - Math.floor(recordingTime / 60) * 60
                      )
                    : "0" +
                      parseInt(
                        recordingTime - Math.floor(recordingTime / 60) * 60
                      ))
                : recordingTime + " segundos..."}
            </p>
          )}
        </Grid>
        <Grid item xs={1} style={{ textAlign: "center" }}>
          {!isRecording && (
            <IconButton
              color="secondary"
              variant="contained"
              onClick={() => setSendFilesOpen(!sendFilesOpen)}
            >
              {sendFilesOpen && <CloseIcon style={{ fontSize: "1.5rem" }} />}
              {!sendFilesOpen && (
                <AttachFileIcon style={{ fontSize: "1.5rem" }} />
              )}
            </IconButton>
          )}
        </Grid>
        <Grid item xs={2} style={{ textAlign: "center" }}>
          {messageText !== "" && (
            <IconButton color="primary" variant="contained" type="submit">
              <SendIcon style={{ fontSize: "1.8rem" }} />
            </IconButton>
          )}
          {messageText === "" && !isRecording && (
            <IconButton
              color="primary"
              variant="contained"
              onClick={() => {
                if (isRecording) {
                  return stopRecording();
                }

                setRecordingTime(0);
                return startRecording();
              }}
            >
              <MicIcon style={{ fontSize: "1.8rem" }} />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </form>
  );
}
