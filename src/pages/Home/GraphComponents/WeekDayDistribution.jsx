// filepath: c:\coding_projects\Leagueoflegends-x5\src\pages\Home\GraphComponents\WeekDayDistribution.jsx
import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

const WeekDayDistribution = ({ stats }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { weekDayDistribution } = stats;

  // Map numeric day to name and ensure they're in order (Sunday to Saturday)
  const dayNames = [
    t("home.weekdays.sunday"),
    t("home.weekdays.monday"),
    t("home.weekdays.tuesday"),
    t("home.weekdays.wednesday"),
    t("home.weekdays.thursday"),
    t("home.weekdays.friday"),
    t("home.weekdays.saturday"),
  ];

  // Convert data to arrays for the chart
  const days = dayNames;
  const numbers = dayNames.map((_, index) => weekDayDistribution[index] || 0);

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
      data: days,
      axisLabel: {
        interval: 0,
        rotate: 45,
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
      bottom: -10,
      left: 5,
    },
  };

  return (
    <Box className="content-box">
      <Typography variant="h6" fontWeight={500}>
        {t("home.charts.gamesPlayedByWeekday")}
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

export default WeekDayDistribution;
