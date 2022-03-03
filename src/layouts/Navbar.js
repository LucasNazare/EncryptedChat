import { Typography, Grid, IconButton } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { Link } from "react-router-dom";

export default function Navbar({
  title,
  backUrl,
  img,
  onImgClick,
  mainMenuBtnOnClickArray,
}) {
  return (
    <div
      style={{
        background: "#490073",
        height: "100%",
      }}
    >
      <Grid
        container
        alignItems={"center"}
        justifyContent={"center"}
        style={{ padding: "2px", height: "100%" }}
      >
        <Grid item xs={2} style={{ textAlign: "center" }}>
          {backUrl && (
            <Link to={backUrl}>
              <ArrowBackIcon
                style={{
                  color: "#ffffff",
                  paddingLeft: "2px",
                  fontSize: "1.5rem",
                }}
              />
            </Link>
          )}
        </Grid>
        <Grid
          item
          xs={
            mainMenuBtnOnClickArray && mainMenuBtnOnClickArray.length > 1
              ? 4
              : 7
          }
        >
          <Typography variant="h1" style={{ padding: "5px" }}>
            {title}
          </Typography>
        </Grid>
        {mainMenuBtnOnClickArray && mainMenuBtnOnClickArray.length > 1 && (
          <Grid item xs={3} style={{ textAlign: "right" }}>
            <IconButton
              variant="contained"
              onClick={mainMenuBtnOnClickArray[0]}
            >
              <AddCommentIcon
                style={{ fontSize: "1.5rem", color: "#ffffff" }}
              />
            </IconButton>
          </Grid>
        )}
        <Grid item xs={3} style={{ textAlign: "center", paddingRight: "2px" }}>
          {img && (
            <img
              src={img}
              style={{ width: "50px", cursor: onImgClick ? "pointer" : "auto" }}
              onClick={onImgClick ? onImgClick : () => ""}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
