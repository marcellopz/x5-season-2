import React from "react";
import { motion } from "framer-motion";
import { CircularProgress, Typography } from "@mui/material";
import "./X5pageContentArea.css"; // Import component-specific CSS

export default function X5pageContentArea({
  children,
  loading,
  title,
  removeMarginTop,
  sx,
  noBackground,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {loading ? (
        <div className="x5-loading-container">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <motion.div
          className={`x5-page-content-area ${
            !noBackground ? "with-background" : ""
          }`}
          style={{
            paddingTop: removeMarginTop ? "0" : "20px",
            ...sx,
          }}
          initial="initial"
          animate="animate"
          variants={{
            initial: {
              opacity: 0,
            },
            animate: {
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            },
          }}
        >
          {title && (
            <div className="x5-page-title">
              <Typography fontSize={25}>{title}</Typography>
            </div>
          )}
          {children}
        </motion.div>
      )}
    </div>
  );
}
