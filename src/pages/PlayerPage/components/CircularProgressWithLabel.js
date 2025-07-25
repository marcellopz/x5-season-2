import { Box, CircularProgress, Typography } from "@mui/material";

export default function CircularProgressWithLabel({
  value,
  size,
  label,
  labelFontSize,
}) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        height: size,
        width: size,
      }}
    >
      <CircularProgress
        variant="determinate"
        value={value * 100}
        size={size}
        color="info"
        sx={{ position: "absolute", zIndex: 2 }}
      />
      <CircularProgress
        variant="determinate"
        value={100}
        color="error"
        size={size}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.primary"
          fontSize={labelFontSize}
          sx={{ width: 100, textAlign: "center" }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
