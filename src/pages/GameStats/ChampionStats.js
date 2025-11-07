import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { floatToPercentageString, getKDA, isObjEmpty } from "../../utils/utils";
import { CHAMPIONICONURL } from "../../common-components/resources";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import "./ChampionStats.css"; // Import component styles

export default function ChampionStats({ champions }) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        field: "championId",
        type: "string",
        headerName: "",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <img
            src={`${CHAMPIONICONURL}${params.row.championId}.png`}
            alt={params.row.championId}
            className="champion-icon"
          />
        ),
      },
      {
        field: "championName",
        type: "string",
        headerName: t("gameStats.championColumns.champion"),
        width: 120,
      },
      {
        field: "picks",
        type: "number",
        headerName: t("gameStats.championColumns.picked"),
        align: "center",
        headerAlign: "center",
        width: 100,
      },
      {
        field: "bans",
        type: "number",
        headerName: t("gameStats.championColumns.banned"),
        align: "center",
        headerAlign: "center",
        width: 100,
      },
      {
        field: "wins",
        type: "string",
        headerName: t("gameStats.championColumns.winRate"),
        align: "center",
        headerAlign: "center",
        width: 110,
        valueGetter: (params) =>
          isNaN(params.row.wins / params.row.picks)
            ? -1
            : params.row.wins / params.row.picks,
        renderCell: (params) =>
          floatToPercentageString(params.row.wins / params.row.picks) || "-",
      },
      {
        field: "kills",
        type: "number",
        headerName: t("gameStats.championColumns.kills"),
        align: "center",
        headerAlign: "center",
        width: 90,
        valueGetter: (params) =>
          isNaN((params.row.kills / params.row.picks).toFixed(1))
            ? "-"
            : (params.row.kills / params.row.picks).toFixed(1),
      },
      {
        field: "deaths",
        type: "number",
        headerName: t("gameStats.championColumns.deaths"),
        align: "center",
        headerAlign: "center",
        width: 100,
        valueGetter: (params) =>
          isNaN((params.row.deaths / params.row.picks).toFixed(1))
            ? "-"
            : (params.row.deaths / params.row.picks).toFixed(1),
      },
      {
        field: "assists",
        type: "number",
        headerName: t("gameStats.championColumns.assists"),
        align: "center",
        headerAlign: "center",
        width: 100,
        valueGetter: (params) =>
          isNaN((params.row.assists / params.row.picks).toFixed(1))
            ? "-"
            : (params.row.assists / params.row.picks).toFixed(1),
      },
      {
        field: "kda",
        type: "string",
        headerName: t("gameStats.championColumns.kda"),
        align: "center",
        headerAlign: "center",
        width: 80,
        valueGetter: (params) =>
          isNaN(getKDA(params.row)) ? "-" : getKDA(params.row),
      },
      {
        field: "creepsKilled",
        type: "number",
        headerName: t("gameStats.championColumns.cs"),
        align: "center",
        headerAlign: "center",
        width: 70,
        valueGetter: (params) =>
          isNaN((params.row.creepsKilled / params.row.picks).toFixed(1))
            ? "-"
            : (params.row.creepsKilled / params.row.picks).toFixed(1),
      },
    ],
    [t]
  );

  if (typeof champions === "undefined" || champions === null || isObjEmpty(champions)) {
    return (
      <div className="champion-stats-container">
        <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
          {t("common.noDataYet")}
        </Typography>
      </div>
    );
  }

  const championsArray = Object.values(champions).map((c) => ({
    ...c,
    id: c.championId,
  }));

  return (
    <div className="champion-stats-container">
      <div className="champion-stats-grid-container">
        <DataGrid
          rows={championsArray}
          columns={columns}
          rowSelection={false}
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          className="champion-stats-datagrid"
          sx={{
            "& .MuiDataGrid-cell": {
              borderColor: "var(--border-light)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid var(--border-light)",
            },
            "& .MuiTablePagination-root": {
              color: "var(--foreground)",
            },
          }}
        />
      </div>
    </div>
  );
}
