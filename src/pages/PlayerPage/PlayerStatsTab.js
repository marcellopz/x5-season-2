import { Typography } from "@mui/material";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { floatToPercentageString } from "../../utils/utils";
import { DataGrid } from "@mui/x-data-grid";
import WinRateChart from "./components/WinRateChart";
import { useNavigate } from "react-router-dom";

const SmallBox = ({ title, value, numberOfGames, t }) => (
  <div
    style={{
      borderRadius: "4px",
      height: "130px",
      background: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      minWidth: "120px",
      flexGrow: 1,
    }}
  >
    <div
      style={{
        margin: "10px 15px",
      }}
    >
      <Typography sx={{ display: "flex", alignItems: "center" }}>
        {title}
      </Typography>
    </div>
    <Typography
      component="div"
      sx={{
        textAlign: "end",
        fontSize: 40,
        margin: "15px 20px",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
      }}
    >
      <div>{value}</div>
      {numberOfGames && (
        <div
          style={{
            fontSize: 15,
            opacity: 0.3,
            alignItems: "center",
            display: "flex",
          }}
        >
          {`${numberOfGames} ${t("playerPage.stats.games")}`}
        </div>
      )}
    </Typography>
  </div>
);

const getColumns = (t) => [
  {
    field: "summonerName",
    headerName: t("playerPage.stats.columns.name"),
    type: "string",
    sortable: true,
    flex: 2,
  },
  {
    field: "wins",
    headerName: t("playerPage.stats.columns.winRate"),
    type: "number",
    align: "center",
    sortable: true,
    flex: 1,
    valueGetter: (params) => params.row.wins / params.row.games || "-",
    renderCell: (params) =>
      floatToPercentageString(params.row.wins / params.row.games) || "-",
  },
  {
    field: "games",
    flex: 1,
    headerName: t("playerPage.stats.columns.games"),
    align: "center",
    sortable: true,
    type: "number",
  },
];

const WinRatePerPlayerList = ({ players, t }) => {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ minWidth: "335px", height: "470px" }}>
        <DataGrid
          rows={players}
          columns={getColumns(t)}
          hideFooter
          rowSelection={false}
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          getRowId={(i) => i.summonerName}
          onRowClick={(a) => navigate("/player/" + a.row.summonerId)}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              background: "rgba(255,255,255,0.08)",
            },
          }}
        />
      </div>
    </div>
  );
};

function PlayerStatsTab({ playerInfo, playerPairs, playerSummary }) {
  const { t } = useTranslation();
  const sameTeam = Object.entries(playerPairs)
    .map(([k, v]) => ({
      games: v.same_team.games,
      wins: v.same_team.wins,
      summonerName: playerSummary[k] ? playerSummary[k].summonerName : k,
      summonerId: k,
    }))
    .sort((a, b) => (a.games > b.games ? -1 : 1));
  const oppositeTeam = Object.entries(playerPairs)
    .map(([k, v]) => ({
      games: v.opposite_team.games,
      wins: v.opposite_team.wins,
      summonerName: playerSummary[k] ? playerSummary[k].summonerName : k,
      summonerId: k,
    }))
    .sort((a, b) => (a.games > b.games ? -1 : 1));
  return (
    <div
      style={{ margin: "20px", display: "flex", flexWrap: "wrap", gap: "20px" }}
    >
      <div
        style={{
          width: "50%",
          flexWrap: "wrap",
          display: "flex",
          gap: "20px",
          flexGrow: 1,
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <WinRateChart winsArray={playerInfo.winsArray} />
        </div>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <SmallBox
            title={t("playerPage.stats.winRateBlue")}
            value={floatToPercentageString(
              playerInfo.statsPerSide.blueSide.wins /
                playerInfo.statsPerSide.blueSide.games
            )}
            numberOfGames={playerInfo.statsPerSide.blueSide.games}
            t={t}
          />
          <SmallBox
            title={t("playerPage.stats.winRateRed")}
            value={floatToPercentageString(
              playerInfo.statsPerSide.redSide.wins /
                playerInfo.statsPerSide.redSide.games
            )}
            numberOfGames={playerInfo.statsPerSide.redSide.games}
            t={t}
          />
          <SmallBox
            title={t("playerPage.stats.totalGames")}
            value={playerInfo.numberOfMatches}
            t={t}
          />
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.2)",
            minWidth: "250px",
            padding: "10px 15px",
          }}
        >
          <p
            style={{
              marginBottom: "20px",
              fontSize: 20,
              display: "flex",
            }}
          >
            {t("playerPage.stats.winRateWith")}
          </p>
          <WinRatePerPlayerList players={sameTeam} t={t} />
        </div>
        <div
          style={{
            flexGrow: 1,
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.2)",
            minWidth: "250px",
            padding: "10px 15px",
          }}
        >
          <p
            style={{
              marginBottom: "20px",
              fontSize: 20,
              display: "flex",
            }}
          >
            {t("playerPage.stats.winRateAgainst")}
          </p>
          <WinRatePerPlayerList players={oppositeTeam} t={t} />
        </div>
      </div>
    </div>
  );
}

export default memo(PlayerStatsTab);
