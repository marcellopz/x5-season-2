import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  getPlayer,
  getPlayerSummaryList,
} from "../../services/firebaseDatabase";
import X5pageContentArea from "../../common-components/X5pageContentArea";
import {
  getWinRateClassName,
  floatToPercentageString,
  getTop3Rank,
} from "../../utils/utils";
import {
  botB64,
  jngB64,
  midB64,
  supB64,
  topB64,
} from "../../assets/images/lanes";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./PlayerList.css"; // Import component styles

// Component for rendering summoner name with tagline
const SummonerNameCell = ({ summonerName, tagLine }) => {
  return (
    <div
      className="pl-summoner-name-container"
      title={`${summonerName}#${tagLine}`}
    >
      <span className="pl-summoner-name">{summonerName}</span>
      {tagLine && <span className="pl-summoner-tagline">#{tagLine}</span>}
    </div>
  );
};

// Component for OP.GG icon
const OpggIconCell = ({ summonerName, tagLine }) => {
  const handleOpggRedirect = (event) => {
    event.stopPropagation(); // Prevent row click navigation
    const region = "br";
    const opggUrl = `https://www.op.gg/summoners/${region}/${summonerName}-${tagLine}`;
    window.open(opggUrl, "_blank");
  };

  return (
    <div className="pl-opgg-cell">
      <img
        src="/opgg.png"
        alt="OP.GG"
        className="pl-opgg-icon"
        onClick={handleOpggRedirect}
      />
    </div>
  );
};

const getColumns = (t) => [
  {
    field: "name",
    headerName: t("playerList.columns.name"),
    type: "string",
    width: 100,
    sortable: true,
  },
  {
    field: "winRate",
    headerName: t("playerList.columns.winRate"),
    type: "string",
    width: 80,
    sortable: true,
    align: "center",
    headerAlign: "center",
    valueGetter: (params) => params.row.winRate,
    cellClassName: (params) => getWinRateClassName(params.row.winRate),
    renderCell: (params) => floatToPercentageString(params.row.winRate),
  },
  {
    field: "opgg",
    headerName: "",
    type: "string",
    width: 50,
    sortable: false,
    align: "center",
    renderCell: (params) => (
      <OpggIconCell
        summonerName={params.row.summonerName}
        tagLine={params.row.tagLine}
      />
    ),
  },
  {
    field: "summonerName",
    headerName: t("playerList.columns.summonerName"),
    type: "string",
    width: 170,
    sortable: true,
    renderCell: (params) => (
      <SummonerNameCell
        summonerName={params.row.summonerName}
        tagLine={params.row.tagLine}
      />
    ),
  },
  {
    field: "numberOfMatches",
    headerName: t("playerList.columns.matches"),
    type: "number",
    align: "center",
    width: 80,
    sortable: true,
  },
  {
    field: "top",
    headerName: "Top",
    type: "number",
    align: "center",
    width: 60,
    sortable: true,
    renderHeader: () => (
      <img
        src={topB64}
        width={40}
        alt={t("playerList.lanes.top")}
        className="lane-icon"
      />
    ),
  },
  {
    field: "jungle",
    headerName: "Jungle",
    type: "number",
    align: "center",
    width: 60,
    sortable: true,
    renderHeader: () => (
      <img
        src={jngB64}
        width={40}
        alt={t("playerList.lanes.jungle")}
        className="lane-icon"
      />
    ),
  },
  {
    field: "mid",
    headerName: "Mid",
    type: "number",
    align: "center",
    width: 60,
    sortable: true,
    renderHeader: () => (
      <img
        src={midB64}
        width={40}
        alt={t("playerList.lanes.mid")}
        className="lane-icon"
      />
    ),
  },
  {
    field: "adc",
    headerName: "Adc",
    type: "number",
    align: "center",
    width: 60,
    sortable: true,
    renderHeader: () => (
      <img
        src={botB64}
        width={40}
        alt={t("playerList.lanes.bot")}
        className="lane-icon"
      />
    ),
  },
  {
    field: "support",
    headerName: "Support",
    type: "number",
    align: "center",
    width: 60,
    sortable: true,
    renderHeader: () => (
      <img
        src={supB64}
        width={40}
        alt={t("playerList.lanes.support")}
        className="lane-icon"
      />
    ),
  },
  {
    field: "avg",
    headerName: t("playerList.columns.avgTop3"),
    type: "number",
    align: "center",
    width: 85,
    sortable: true,
    valueGetter: (params) => getTop3Rank(params.row),
  },
];

export default function PlayerList() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState({});
  const [playersSummary, setPlayersSummary] = useState({});
  const [playersWithStats, setPlayersWithStats] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const players_ = await getPlayer("");
      setPlayers(players_);
    })();
    (async () => {
      const players_ = await getPlayerSummaryList();
      setPlayersSummary(players_ ?? {});
    })();
  }, []);

  useEffect(() => {
    const ps = Object.keys(players ?? {}).map((p, i) => {
      return {
        ...players[p],
        winRate: playersSummary[players[p]?.account_id]?.winRate ?? 0,
        summonerName:
          playersSummary[players[p]?.account_id]?.summonerName ?? "",
        tagLine: playersSummary[players[p]?.account_id]?.tagLine ?? "",
        numberOfMatches:
          playersSummary[players[p]?.account_id]?.numberOfMatches ?? 0,
        id: i,
        player_id: p,
      };
    });
    setPlayersWithStats(ps.filter((p) => !p.hide && p.numberOfMatches > 0));
  }, [players, playersSummary]);

  return (
    <X5pageContentArea
      title={t("playerList.title")}
      loading={playersWithStats.length === 0}
    >
      <div className="player-list-grid-container">
        <DataGrid
          rows={playersWithStats}
          columns={getColumns(t)}
          hideFooter
          rowSelection={false}
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          className="player-list-datagrid"
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
          onRowClick={(a) => Navigate("/player/" + a.row.player_id)}
        />
      </div>
    </X5pageContentArea>
  );
}
