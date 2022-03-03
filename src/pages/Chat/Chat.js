import { Fab, Grid } from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import logo from "../../assets/imgs/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import ChatContent from "./ChatContent";
import SendForm from "./SendForm";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ChatDetails from "./ChatDetails";
import { CameraFeed } from "./CameraFeed";
import SendFiles from "./SendFiles";
import useRecorder from "../../hooks/useRecorder";
import StopIcon from "@mui/icons-material/Stop";

export default function Chat({ socket }) {
  const { token, user, logout } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatDetailsOpen, setChatDetailsOpen] = useState(false);
  const [sendFilesOpen, setSendFilesOpen] = useState(false);
  const scrollRef = useRef();
  const mounted = useRef(false);

  //Send Files
  const [selectedImage, setSelectedImage] = useState(null);
  let [
    audioURL,
    setAudioURL,
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    setAudioBlob,
  ] = useRecorder();
  const [recordingTime, setRecordingTime] = useState(-1);

  async function getMessages() {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let chatRes = await axios.get(
        "http://localhost/api/chats/" + params.id,
        config
      );
      let messagesRes = await axios.get(
        "http://localhost/api/messages/by_id/" + params.id,
        config
      );
      if (chatRes.data && messagesRes.data) {
        setChat(messagesRes.data);
        setChatData(chatRes.data);

        socket.emit("joinRoom", chatRes.data._id);
        setLoading(false);
      } else {
        alert("Erro na conexao");
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      console.log(e.response?.data);
      logout();
    }
  }
  useEffect(() => {
    if (!loading)
      socket.on("receiveMessage", async (data) => {
        if (mounted) {
          try {
            const config = {
              headers: { Authorization: `Bearer ${token}` },
            };
            //setChat(data.msgs);
            getMessages();
          } catch (e) {
            console.log(e.response?.data);
          }
        }
      });
  }, [loading]);
  useEffect(() => {
    mounted.current = true;
    if (params?.id) {
      getMessages();
    } else {
      navigate("/");
    }
    return () => {
      socket.off("receiveMessage");
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  useEffect(() => {
    if (recordingTime > -1)
      setTimeout(
        () => isRecording && setRecordingTime(recordingTime + 1),
        1000
      );
  }, [recordingTime]);

  const handleProfileOpen = () => {
    setChatDetailsOpen(true);
  };

  if (loading) return <div>Descriptografando</div>;
  else
    return (
      <div>
        <Grid container alignItems="center" justifyContent={"center"}>
          <Grid item xs={12} style={{ height: "13vh" }}>
            <Navbar
              title={chatData.name}
              backUrl={"/"}
              img={chatData?.photoUrl ? chatData.photoUrl : logo}
              onImgClick={handleProfileOpen}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              height: "80vh",
              overflowY: "auto",
              background: "#fff1e8",
            }}
          >
            <ChatContent
              token={token}
              chat={chat}
              style={{ height: "100%" }}
              chatData={chatData}
              scrollRef={scrollRef}
            />
            <SendFiles
              chat={chat}
              chatData={chatData}
              setChat={setChat}
              open={sendFilesOpen}
              socket={socket}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              audioURL={audioURL}
              setAudioURL={setAudioURL}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              audioBlob={audioBlob}
              setAudioBlob={setAudioBlob}
            />
            {isRecording && (
              <Fab
                color="secondary"
                variant="outlined"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  zIndex: 99999,
                }}
                onClick={() => {
                  if (isRecording) {
                    setRecordingTime("Girafa");
                    return stopRecording();
                  }

                  return startRecording();
                }}
              >
                <StopIcon style={{ fontSize: "1.8rem" }} />
              </Fab>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              overflowY: "auto",
              background: "#fff9f5",
              position: "fixed",
              height: "58px",
              width: "100%",
              marginTop: "58x",
              bottom: 0,
            }}
          >
            <SendForm
              chat={chat}
              chatData={chatData}
              setChat={setChat}
              socket={socket}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              sendFilesOpen={sendFilesOpen}
              setSendFilesOpen={setSendFilesOpen}
              audioURL={audioURL}
              setAudioURL={setAudioURL}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              recordingTime={recordingTime}
              setRecordingTime={setRecordingTime}
              audioBlob={audioBlob}
              setAudioBlob={setAudioBlob}
            />
          </Grid>
        </Grid>
        <ChatDetails
          open={chatDetailsOpen}
          close={() => setChatDetailsOpen(false)}
          chatData={chatData}
          setChatData={setChatData}
          canEdit={chatData.admins?.includes(user._id)}
        />
      </div>
    );
}
