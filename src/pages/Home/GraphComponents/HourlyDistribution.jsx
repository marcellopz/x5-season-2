// filepath: c:\coding_projects\Leagueoflegends-x5\src\pages\Home\GraphComponents\HourlyDistribution.jsx
import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

const HourlyDistribution = ({ stats }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { hourlyDistribution } = stats;

  // Create hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => {
    // Format with AM/PM for better readability
    return i === 0
      ? "12 AM"
      : i < 12
      ? `${i} AM`
      : i === 12
      ? "12 PM"
      : `${i - 12} PM`;
  });

  // Get game counts for each hour
  const numbers = Array.from(
    { length: 24 },
    (_, i) => hourlyDistribution[i] || 0
  );

  const option = {
    textStyle: {
      color: theme.palette.text.primary,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: hours,
      axisLabel: {
        interval: 1, // Show every other label to avoid crowding
        rotate: 45, // Rotate labels for better fit
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: t("home.charts.gamesPlayed"),
        type: "bar",
        data: numbers,
        itemStyle: {
          color: theme.palette.primary.light,
          borderRadius: [20, 20, 0, 0],
        },
      },
    ],
    grid: {
      containLabel: true,
      top: 20,
      right: 5,
      bottom: -5,
      left: 5,
    },
  };

  return (
    <Box className="content-box">
      <Typography variant="h6" fontWeight={500}>
        {t("home.charts.gamesPlayedByHour")}
      </Typography>
      <ReactEcharts
        option={option}
        style={{
          width: "100%",
          height: "100%",
          flexGrow: 1,
        }}
      />
    </Box>
  );
};

export default HourlyDistribution;
