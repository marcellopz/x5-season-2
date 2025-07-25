import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

const GameDurationHistogram = ({ stats }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { gameDurationHistogram } = stats;

  // Convert data to arrays for the chart
  const intervals = Object.keys(gameDurationHistogram);
  const counts = intervals.map((interval) => gameDurationHistogram[interval]);

  const option = {
    textStyle: {
      color: theme.palette.text.primary,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const interval = params[0].name;
        const count = params[0].value;
        return `${interval} min: ${count} games`;
      },
    },
    xAxis: {
      type: "category",
      data: intervals,
      name: t("home.charts.gameDurationMinutes"),
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      name: t("home.charts.numberOfGamesAxis"),
      nameLocation: "middle",
      nameGap: 40,
    },
    series: [
      {
        name: t("home.charts.gameCount"),
        type: "bar",
        data: counts,
        itemStyle: {
          color: theme.palette.primary.light,
          borderRadius: [20, 20, 0, 0],
        },
        barWidth: "60%",
      },
    ],
    grid: {
      containLabel: true,
      top: 20,
      right: 5,
      bottom: 20,
      left: 5,
    },
  };

  return (
    <Box className="content-box">
      <Typography variant="h6" fontWeight={500}>
        {t("home.charts.gameDurationDistribution")}
      </Typography>
      <ReactEcharts
        option={option}
        style={{
          flexGrow: 1,
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
};

export default GameDurationHistogram;
