import React, { memo, useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";
import RequestButton from "./RequestButton";
import { requestToBeANerd } from "../../services/firebaseDatabase";
import Sidebar from "./Sidebar";
import { Button, IconButton, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import grilhaIcon from "./grilhaIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navbar.css";

function Navbar() {
  const { t } = useTranslation();
  const {
    userObj,
    signOut,
    isNerd,
    isAnonymous,
    isAdmin,
    isNull,
    loadStoreAuth,
  } = useContext(AuthContext);

  const navbarItems = [
    { label: t("navbar.matchHistory"), url: "/history" },
    { label: t("navbar.matchmaking"), url: "/matchmaking" },
    { label: t("navbar.playerList"), url: "/players" },
    { label: t("navbar.gameStatsNav"), url: "/gamestats" },
  ];
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [hover, setHover] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isNull) {
      if (loadStoreAuth()) {
        return () => {};
      }
      // signInAsGuest();
    }
  }, [isNull, loadStoreAuth]);

  // if (isNull) {
  //   return (
  //     <div style={{ display: "flex", marginTop: "100px" }}>
  //       <div style={{ margin: "auto" }}>
  //         <CircularProgress />
  //       </div>
  //     </div>
  //   );
  // }

  const requestToBeNerd = (name) => {
    if (isAnonymous) {
      return;
    }
    requestToBeANerd(userObj.uid, name);
    alert(t("auth.requestPermissionDialog.requestSent"));
  };

  return (
    <>
      <Sidebar
        navbarItems={navbarItems}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <nav className="navbar">
        <div className="navbar-section">
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/home" className="navbar-brand-link">
                <div style={{ position: "relative" }}>
                  <img src={grilhaIcon} className="navbar-logo" alt="icon" />
                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      left: -2,
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("common.season")}
                  </Typography>
                </div>

                <div className="navbar-brand-text">
                  <h3 className="navbar-brand-line">x5</h3>
                  <h3 className="navbar-brand-line">dos</h3>
                  <h3 className="navbar-brand-line">nerds</h3>
                </div>
              </Link>
            </li>
            {navbarItems.map((item) => (
              <motion.li
                key={item.label}
                className="navbar-item navbar-desktop-item"
                onMouseEnter={() => setHover(item.url)}
                onMouseLeave={() => setHover("")}
                initial={{ borderBottom: "4px solid transparent" }}
                transition={{ duration: 0.2 }}
                animate={{
                  borderBottom:
                    window.location.pathname === item.url || hover === item.url
                      ? "4px solid white"
                      : "4px solid transparent",
                }}
              >
                <Link to={item.url} className="navbar-link">
                  <h1 className="navbar-link-title">{item.label}</h1>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="navbar-list navbar-desktop-controls">
            {isAdmin && (
              <li className="navbar-right-item">
                <Link to="admin">
                  <Button variant="outlined" color="primary">
                    {t("navbar.adminPage")}
                  </Button>
                </Link>
              </li>
            )}
            <li className="navbar-right-item">
              <h1>{userObj?.displayName}</h1>
            </li>
            <li className="navbar-right-item">
              {isNull || isAnonymous ? (
                <Link to="/auth/login">
                  <Button variant="contained" color="primary">
                    {t("common.login")}
                  </Button>
                </Link>
              ) : (
                <Button onClick={signOut} variant="outlined" color="primary">
                  {t("common.logout")}
                </Button>
              )}
            </li>
            <li className="navbar-right-item">
              <LanguageSwitcher />
            </li>
            {!isNerd && !isAnonymous && (
              <li className="navbar-right-item">
                <RequestButton
                  open={requestDialogOpen}
                  setOpen={setRequestDialogOpen}
                  requestToBeNerd={requestToBeNerd}
                />
              </li>
            )}
          </ul>
          <div className="navbar-mobile-controls">
            {!isNerd && !isAnonymous && (
              <RequestButton
                open={requestDialogOpen}
                setOpen={setRequestDialogOpen}
                requestToBeNerd={requestToBeNerd}
              />
            )}
            {isAdmin && (
              <div className="navbar-right-item">
                <Link to="admin">
                  <Button variant="contained" color="primary">
                    {t("navbar.adminPage")}
                  </Button>
                </Link>
              </div>
            )}
            {isNull || isAnonymous ? (
              <Link to="/auth/login">
                <Button variant="contained" color="primary">
                  {t("common.login")}
                </Button>
              </Link>
            ) : (
              <Button onClick={signOut} variant="outlined" color="primary">
                {t("common.logout")}
              </Button>
            )}
            <LanguageSwitcher />

            <IconButton
              onClick={() => setSidebarOpen(true)}
              className="navbar-mobile-button"
            >
              <Menu fontSize="large" />
            </IconButton>
          </div>
        </div>
      </nav>
    </>
  );
}

export default memo(Navbar);
