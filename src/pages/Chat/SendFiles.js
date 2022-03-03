import { IconButton, Zoom } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MicIcon from "@mui/icons-material/Mic";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import React, { useContext, useState } from "react";
import ImagePreview from "./ImagePreview";
import AudioPreview from "./AudioPreview";
import useRecorder from "../../hooks/useRecorder";
import Close from "@mui/icons-material/Close";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { CameraFeed } from "./CameraFeed";
import { useNavigate } from "react-router-dom";

export default function SendFiles({
  chat,
  chatData,
  setChat,
  open,
  socket,
  selectedImage,
  setSelectedImage,
  audioURL,
  setAudioURL,
  isRecording,
  startRecording,
  stopRecording,
}) {
  const { token, kMap, IV } = useContext(AuthContext);
  const [cameraImage, setCameraImage] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const navigate = useNavigate();

  const submitImage = async () => {
    let k = kMap.find((m) => m.id === chatData._id)?.k;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const file = new File([selectedImage.raw], selectedImage.raw.name);
      const formData = new FormData();
      formData.append("chatId", chatData._id);
      formData.append("k", k);
      formData.append("image", file);
      let res = await axios.post(
        "http://18.230.11.27/api/messages/send-image",
        formData,
        config
      );
      if (res.data) {
        let msgRes = await axios.post(
          "http://18.230.11.27/api/messages/send",
          {
            type: "IMAGE",
            chatId: chatData._id,
            content: res.data.filename,
          },
          config
        );

        if (msgRes.data) {
          let arr = [...chat];
          let newMsg = { ...msgRes.data };
          arr.push(newMsg);
          setChat(arr);

          socket.emit("sendMessage", msgRes.data, token);
        }
      }
    } catch (e) {
      console.log(e);
      console.log(e.response?.data);
    }
  };
  //if (cameraOn) return <CameraFeed setCameraOn={setCameraOn} />;
  return (
    <Zoom
      in={open}
      style={{ position: "absolute", bottom: "58px", left: "70%" }}
    >
      <div>
        <ImagePreview
          image={selectedImage}
          setImage={setSelectedImage}
          send={submitImage}
        />
        <input
          type="file"
          id="upload-image-button"
          accept="image/png, image/gif, image/jpeg"
          style={{ display: "none" }}
          multiple
          onChange={(e) => {
            setSelectedImage({
              preview: URL.createObjectURL(e.target.files[0]),
              raw: e.target.files[0],
            });
          }}
        />

        <label htmlFor="upload-image-button">
          <IconButton
            component="span"
            variant="outlined"
            style={{
              zIndex: 1000,
              background: "#490073",
              color: "white",
              margin: "10px",
            }}
          >
            <ImageIcon style={{ fontSize: "1.7rem", padding: "3px" }} />
          </IconButton>
        </label>
        {/* <IconButton
          variant="outlined"
          style={{
            zIndex: 1000,
            background: "#fd6000",
            color: "white",
            margin: "10px",
          }}
          onClick={() => setCameraOn(true)}
        >
          <CameraAltIcon style={{ fontSize: "1.7rem", padding: "3px" }} />
        </IconButton> */}
      </div>
    </Zoom>
  );
}
