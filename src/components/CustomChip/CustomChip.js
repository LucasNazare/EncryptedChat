import { Chip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/imgs/logo.png";
import React from "react";

export default function CustomChip({
  text,
  _id,
  btnCallback,
  color,
  textColor,
  icon,
}) {
  return (
    <Chip
      label={text}
      icon={<img src={logo} style={{ width: "25px" }} />}
      onDelete={btnCallback}
      deleteIcon={
        <div style={{ color: "white", fontWeight: 1, fontSize: "1rem" }}>x</div>
      }
      style={{
        marginTop: "2px",
        marginBottom: "2px",
        marginLeft: "2px",
        marginRight: "2px",
        paddingTop: "5px",
        paddingBottom: "8px",
        paddingRight: btnCallback ? "10px" : "10px",
        paddingLeft: "10px",
        background: color,
        color: textColor,
        borderRadius: "20px",
        fontFamily: "'VT323'",
        fontSize: "1.3rem",
      }}
    />
  );
}
