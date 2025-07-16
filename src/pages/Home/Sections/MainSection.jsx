import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CardDisplay from "../../../common-components/CardDisplay/CardDisplay";
import GeneralStatsBox from "../GraphComponents/GeneralStatsBox";
import PatchNotes from "../GraphComponents/PatchNotes";
// import { AuthContext } from "../../../contexts/authContext";
import "./MainSection.css";

const MainSection = ({ stats, players }) => {
  const { t } = useTranslation();
  // const { isAnonymous } = useContext(AuthContext);
  return (
    <Box className="main-section-container" id="main-section">
      <Box className="mainsection-panel mainsection-large-panel mainsection-cards-container">
        <Typography variant="h5" className="mainsection-cards-title">
          {t("home.legendCards")}
        </Typography>
        {players && Object.keys(players).length > 0 ? (
          <CardDisplay players={players} />
        ) : (
          <Box className="mainsection-cards-loading">
            {t("home.loadingPlayerCards")}
          </Box>
        )}
        {/* {isAnonymous && (
          <span className="mainsection-anonymous-message">
            To see the card's real photos, please log in and request permission.
          </span>
        )} */}
      </Box>
      <GeneralStatsBox stats={stats} players={players} />
      <PatchNotes />
    </Box>
  );
};

export default MainSection;
