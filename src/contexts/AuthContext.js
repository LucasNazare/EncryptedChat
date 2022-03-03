import React, { useEffect, useState } from "react";
export const AuthContext = React.createContext();

const DEFAULT_TIMEOUT = 60 * 60 * 2;
export default function AuthProvider(props) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [counter, setCounter] = useState(DEFAULT_TIMEOUT);
  const [k, setK] = useState("");
  const [kMap, setKMap] = useState([]);
  const K_SECRET =
    "91304201a7cabbf108435e33ddff98d40b0846f330d7585982d0144fe4da552ed15f9854f6161dec9a1e1e8acf3ae6b409ce";
  const IV =
    "25b291b2c3edf58878472014157ed353179c1c7c1bd1cea915fa73cecbf4699009fd2ae2011b7441efc850c39102cc68d934";

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter <= 0) {
      logout();
    }
  }, [counter]);

  useEffect(() => {
    setCounter(DEFAULT_TIMEOUT);
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken,
        setUser,
        logout,
        K_SECRET,
        IV,
        k,
        setK,
        kMap,
        setKMap,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
