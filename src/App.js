import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Conversas from "./pages/Conversas/Conversas";
import Login from "./pages/Login/Login";
import "./App.css";
import Chat from "./pages/Chat/Chat";
import NewGroup from "./pages/NewChat/NewChat";
import NewChat from "./pages/NewChat/NewChat";
import AuthProvider, { AuthContext } from "./contexts/AuthContext";
import { useContext, useState } from "react";
import FirstLogin from "./pages/Login/FirstLogin";
import ChangePassword from "./pages/Login/ChangePassword";
import { io } from "socket.io-client";

const font = "VT323";
const theme = createTheme({
  typography: { fontFamily: font },
  palette: {
    primary: {
      main: "#490073",
    },
    secondary: { main: "#fd6000" },
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
      fontFamily: "'VT323'",
      color: "#ffffff",
    },
    h2: {
      fontSize: "1.2rem",
    },
    h2: {
      fontSize: "1.2rem",
    },
    h6: {
      fontSize: "1.2rem",
      fontFamily: "'VT323'",
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'VT323'",
        },
      },
    },
  },
});

const socket = io("ws://18.230.11.27:3900");
function App() {
  const { user, token } = useContext(AuthContext);
  const [reMount, setReMount] = useState(0);
  const forceReMount = () => {
    setReMount(reMount + 1);
  };
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user && token ? (
                <Conversas
                  key={reMount}
                  forceReMount={forceReMount}
                  socket={socket}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={user && token ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/change-password"
            element={
              user && token ? <ChangePassword /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/first-login"
            element={user && token ? <FirstLogin /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat/:id"
            element={
              user && token ? (
                <Chat socket={socket} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/novo-grupo"
            element={
              user && token ? (
                <NewChat socket={socket} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
