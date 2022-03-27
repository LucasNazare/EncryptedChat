import { Grid } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Navbar from "../../layouts/Navbar";
import logo from "../../assets/imgs/logo.png";
import Content from "./Content";
import SendForm from "../Chat/SendForm";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import Profile from "./Profile";
const CryptoJS = require("crypto-js");

export default function Conversas({ forceReMount, socket }) {
  const { token, user, logout, k, IV, kMap, setKMap } = useContext(AuthContext);
  const mounted = useRef(false);
  const [chats, setChats] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleProfileOpen = () => {
    setProfileOpen(true);
  };
  const handleNewGroup = () => {
    navigate("/novo-grupo");
  };

  async function getConversas() {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let gkRes = await axios.post(
        "https://saferabbit.tk/api/chats/set-gk",
        { k, iv: IV },
        config
      );
      let res = await axios.get("https://saferabbit.tk/api/chats/", config);
      let kArr = [];
      if (res.data) {
        let arr = [];
        res.data.map((chat) => {
          arr.push(chat._id);
          let encrypted = chat.participants?.find(
            (p) => p.id === user._id
          )?.encK;
          let decrypted = CryptoJS.AES.decrypt(
            encrypted,
            CryptoJS.enc.Hex.parse(k),
            {
              iv: CryptoJS.enc.Hex.parse(user._id + IV),
            }
          );
          decrypted = decrypted.toString(CryptoJS.enc.Utf8);
          kArr.push({ id: chat._id, k: decrypted });
        });
        setKMap(kArr);
        socket.emit("joinRoom", arr);

        setChats(res.data);
        setLoading(false);
      } else {
        alert("Erro na conexao");
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      logout();
    }
  }
  useEffect(() => {
    if (!loading) {
      socket.on("receiveMessage", (data) => {
        if (mounted) {
          setChats(data.chats);
        }
      });
      socket.on("chatCreated", async (message) => {
        getConversas();
      });
    }
  }, [loading]);

  useEffect(() => {
    mounted.current = true;
    getConversas();
    return () => {
      socket.off("receiveMessage");
      socket.off("chatCreated");
      mounted.current = false;
    };
  }, []);
  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          fontFamily: "'VT323'",
          height: "100vw",
          background: "#fff9f5",
        }}
      >
        <h1
          style={{
            color: "lightgray",
            fontWeight: "300",
            fontSize: "2.5rem",
          }}
        >
          Descriptografando...
        </h1>
      </div>
    );
  else if (user.firstLogin) return <Navigate to="/first-login" />;
  else
    return (
      <div>
        <Grid container alignItems={"center"} justifyContent={"center"}>
          <Grid item xs={12} style={{ height: "13vh" }}>
            <Navbar
              title="Conversas"
              img={logo}
              onImgClick={handleProfileOpen}
              mainMenuBtnOnClickArray={[handleNewGroup, handleNewGroup]}
            />
          </Grid>
          <Grid item xs={12} style={{ height: "87vh", overflowY: "auto" }}>
            <Content chats={chats} kMap={kMap} />
          </Grid>
        </Grid>
        <Profile
          open={profileOpen}
          close={() => setProfileOpen(false)}
          user={user}
          logoutVisible
        />
      </div>
    );
}
