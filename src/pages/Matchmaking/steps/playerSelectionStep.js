import React, { useContext, useEffect, useState, useMemo, memo } from "react";
import {
  isWildcardValid,
  MatchMakingContext,
} from "../context/matchMakingContext";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { List, Search, Clear } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "./playerSelectionStep.css";

const getColumns = (t) => [
  {
    field: "name",
    headerName: t("matchmaking.playerSelection.columns.name"),
    type: "string",
    width: 120,
    sortable: true,
  },
  {
    field: "top",
    headerName: t("matchmaking.playerSelection.columns.top"),
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "jungle",
    headerName: t("matchmaking.playerSelection.columns.jungle"),
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "mid",
    headerName: t("matchmaking.playerSelection.columns.mid"),
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "adc",
    headerName: t("matchmaking.playerSelection.columns.adc"),
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "support",
    headerName: t("matchmaking.playerSelection.columns.support"),
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
];

const WildcardCard = ({ id, wildcardDetails, setWildcardDetails }) => {
  const { t } = useTranslation();
  const wildCard = wildcardDetails[id];
  const isValid = isWildcardValid(wildCard);
  function handleChange(e) {
    const { name, value } = e.target;
    setWildcardDetails((prev) => {
      const updated = [...prev];
      if (name === "name") {
        updated[id] = {
          ...updated[id],
          name: value,
        };
        return updated;
      }
      const valueInt = parseInt(value);
      if (isNaN(valueInt) || valueInt > 15) {
        return prev;
      }
      updated[id] = {
        ...updated[id],
        [name]: valueInt,
      };
      return updated;
    });
  }

  return (
    <div className={`wildcard-card ${isValid ? "valid" : "invalid"}`}>
      <Box className="wildcard-input-row">
        <Typography className="wildcard-label">
          {t("matchmaking.playerSelection.wildcardLabels.name")}:
        </Typography>
        <TextField
          required
          name="name"
          size="small"
          type="text"
          className="wildcard-input"
          sx={{ width: "100px" }}
          value={wildcardDetails[id]?.name || ""}
          onChange={handleChange}
        />
      </Box>
      <Box className="wildcard-input-row">
        <Typography className="wildcard-label">
          {t("matchmaking.playerSelection.wildcardLabels.top")}:
        </Typography>
        <TextField
          required
          name="top"
          size="small"
          type="number"
          className="wildcard-input"
          sx={{ width: "60px" }}
          value={wildcardDetails[id]?.top || ""}
          onChange={handleChange}
        />
      </Box>
      <Box className="wildcard-input-row">
        <Typography className="wildcard-label">
          {t("matchmaking.playerSelection.wildcardLabels.jungle")}:
        </Typography>
        <TextField
          required
          name="jungle"
          size="small"
          type="number"
          className="wildcard-input"
          sx={{ width: "60px" }}
          value={wildcardDetails[id]?.jungle || ""}
          onChange={handleChange}
        />
      </Box>
      <Box className="wildcard-input-row">
        <Typography className="wildcard-label">
          {t("matchmaking.playerSelection.wildcardLabels.mid")}:
        </Typography>
        <TextField
          required
          name="mid"
          size="small"
          type="number"
          className="wildcard-input"
          sx={{ width: "60px" }}
          value={wildcardDetails[id]?.mid || ""}
          onChange={handleChange}
        />
      </Box>
      <Box className="wildcard-input-row">
        <Typography className="wildcard-label">
          {t("matchmaking.playerSelection.wildcardLabels.adc")}:
        </Typography>
        <TextField
          required
          name="adc"
          size="small"
          type="number"
          className="wildcard-input"
          sx={{ width: "60px" }}
          value={wildcardDetails[id]?.adc || ""}
          onChange={handleChange}
        />
      </Box>
      <Box className="wildcard-input-row">
        <Typography className="wildcard-label">
          {t("matchmaking.playerSelection.wildcardLabels.support")}:
        </Typography>
        <TextField
          required
          name="support"
          size="small"
          type="number"
          className="wildcard-input"
          sx={{ width: "60px" }}
          value={wildcardDetails[id]?.support || ""}
          onChange={handleChange}
        />
      </Box>
    </div>
  );
};

// Create a memoized PlayerCard component
const PlayerCard = memo(({ card, isSelected, isVisible, onClick }) => {
  return (
    <Box
      onClick={onClick}
      className={`player-card ${isSelected ? "selected" : ""}`}
      style={{
        display: isVisible ? "block" : "none",
      }}
    >
      <div style={{ height: "300px" }}>{card.card}</div>
    </Box>
  );
});

export default function PlayerSelectionStep({ setIsOk }) {
  const { t } = useTranslation();
  const {
    players,
    cards,
    handleOptionChange,
    selectedOptions,
    error,
    setSelectedOptions,
    cardReadyCounter,
    numberOfWildcards,
    setNumberOfWildcards,
    wildcardDetails,
    setWildcardDetails,
  } = useContext(MatchMakingContext);
  const [displayCard, setDisplayCard] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = getColumns(t);

  const arrayOfPlayers =
    Object.keys(players ?? {}).map((player, i) => ({
      ...players[player],
      id: i,
      player_id: player,
    })) ?? [];

  useEffect(() => {
    setIsOk(!error);
  }, [error, setIsOk]);

  // Handle keyboard shortcut for search field focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search field when Ctrl+F or Cmd+F is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("player-search-field")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Create a memoized function to determine if a card should be visible based on the search term
  const isCardVisible = useMemo(() => {
    // Create a lookup map for fast filtering
    const visibleCardsMap = new Map();

    cards.forEach((card) => {
      let isVisible = true;

      if (searchTerm.trim() !== "") {
        isVisible = false;
        const term = searchTerm.toLowerCase();
        const playerData = players?.[card.name];

        // Check if name contains search term
        if (card.name.toLowerCase().includes(term)) {
          isVisible = true;
        }
        // Check role ratings if term is a number
        else if (playerData && !isNaN(term)) {
          isVisible =
            String(playerData.top || "") === term ||
            String(playerData.jungle || "") === term ||
            String(playerData.mid || "") === term ||
            String(playerData.adc || "") === term ||
            String(playerData.support || "") === term;
        }
      }

      visibleCardsMap.set(card.name, isVisible);
    });

    return (cardName) => visibleCardsMap.get(cardName) || false;
  }, [cards, players, searchTerm]);

  // Create a memoized array of filtered card names for counting
  const filteredCardCount = useMemo(
    () => cards.filter((card) => isCardVisible(card.name)).length,
    [cards, isCardVisible]
  );

  // Filter array of players for DataGrid with the same logic
  const filteredPlayers =
    searchTerm.trim() === ""
      ? arrayOfPlayers
      : arrayOfPlayers.filter((player) => {
          try {
            const term = searchTerm.toLowerCase();

            // Check player name
            if (player.name?.toLowerCase().includes(term)) return true;

            // Check if search term is a number and matches any role rating
            const numericSearch = !isNaN(term);
            if (numericSearch) {
              // Safely convert to string and compare
              return (
                String(player.top || "") === term ||
                String(player.jungle || "") === term ||
                String(player.mid || "") === term ||
                String(player.adc || "") === term ||
                String(player.support || "") === term
              );
            }

            return false;
          } catch (error) {
            console.error("Error filtering players:", error);
            return false;
          }
        });

  // Memoized card components to prevent re-rendering
  const cardComponents = useMemo(() => {
    return cards.map((card) => (
      <PlayerCard
        key={card.name}
        card={card}
        isSelected={selectedOptions.includes(card.name)}
        isVisible={cards.length <= cardReadyCounter && isCardVisible(card.name)}
        onClick={() => handleOptionChange(card.name)}
      />
    ));
  }, [
    cards,
    selectedOptions,
    cardReadyCounter,
    isCardVisible,
    handleOptionChange,
  ]);

  return (
    <div className="player-selection-form">
      <div className="player-selection-header">
        <div>
          <Typography className="player-selection-title">
            {t("matchmaking.playerSelection.title")}
          </Typography>
          <Box className="player-selection-status">
            <Typography className={error ? "status-error" : "status-valid"}>
              {selectedOptions.length +
                wildcardDetails?.filter(isWildcardValid).length}{" "}
              {t("matchmaking.playerSelection.validPlayersSelected")}
            </Typography>
            {error && (
              <Typography className="status-error">
                - {t("matchmaking.playerSelection.needExactly10Players")}
              </Typography>
            )}
          </Box>
        </div>
        <IconButton
          className="view-toggle-button"
          onClick={() => setDisplayCard((prev) => !prev)}
        >
          <List />
        </IconButton>
      </div>

      <form>
        <Box className="controls-container">
          <Box className="wildcard-counter">
            <Typography className="wildcard-counter-label">
              {t("matchmaking.playerSelection.numberOfWildcards")}:
            </Typography>
            <Button
              variant="outlined"
              className="wildcard-counter-button"
              onClick={() => {
                if (numberOfWildcards > 0) {
                  setNumberOfWildcards((prev) => prev - 1);
                }
              }}
            >
              -
            </Button>
            <TextField
              size="small"
              type="number"
              className="wildcard-counter-input"
              value={numberOfWildcards}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              variant="outlined"
              className="wildcard-counter-button"
              onClick={() => {
                if (numberOfWildcards < 10) {
                  setNumberOfWildcards((prev) => prev + 1);
                }
              }}
            >
              +
            </Button>
          </Box>

          <Box className="player-search">
            <Tooltip
              title={t("matchmaking.playerSelection.searchTooltip")}
              placement="top"
            >
              <TextField
                id="player-search-field"
                size="small"
                type="text"
                className="player-search-input"
                placeholder={t("matchmaking.playerSelection.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchTerm("");
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <Search
                      style={{ color: "var(--gray-300)", marginRight: "8px" }}
                    />
                  ),
                  endAdornment: searchTerm && (
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm("")}
                      style={{ visibility: searchTerm ? "visible" : "hidden" }}
                    >
                      <Clear
                        style={{ color: "var(--gray-300)", fontSize: "18px" }}
                      />
                    </IconButton>
                  ),
                  sx: { borderRadius: "var(--radius)" },
                }}
              />
            </Tooltip>
          </Box>
        </Box>
        {numberOfWildcards > 0 && (
          <div className="wildcards-container">
            {Array.from({ length: numberOfWildcards }, (_, i) => (
              <WildcardCard
                key={i}
                id={i}
                wildcardDetails={wildcardDetails}
                setWildcardDetails={setWildcardDetails}
              />
            ))}
          </div>
        )}
        {displayCard && (
          <div className="player-cards-container">
            {cards.length > 0 ? (
              <>
                {cardComponents}
                {filteredCardCount === 0 &&
                  searchTerm &&
                  cards.length <= cardReadyCounter && (
                    <Typography className="no-results-message">
                      {t("matchmaking.playerSelection.noPlayersMatch")}
                    </Typography>
                  )}
              </>
            ) : searchTerm && cards.length <= cardReadyCounter ? (
              <Typography className="no-results-message">
                {t("matchmaking.playerSelection.noPlayersMatch")}
              </Typography>
            ) : null}
            {cards.length > cardReadyCounter && (
              <CircularProgress
                sx={{ marginTop: "50px", marginBottom: "900px" }}
              />
            )}
          </div>
        )}
        {!displayCard && (
          <div className="player-selection-grid">
            {players && (
              <>
                {filteredPlayers.length > 0 ? (
                  <DataGrid
                    rows={filteredPlayers}
                    columns={columns}
                    density="compact"
                    checkboxSelection
                    hideFooter
                    onRowSelectionModelChange={(selectedRows) =>
                      setSelectedOptions(
                        selectedRows.map(
                          (index) => filteredPlayers[index].player_id
                        )
                      )
                    }
                    rowSelectionModel={selectedOptions
                      .map((playerId) =>
                        filteredPlayers.findIndex(
                          (player) => player.player_id === playerId
                        )
                      )
                      .filter((index) => index !== -1)}
                    sx={{
                      "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                        {
                          display: "none",
                        },
                    }}
                  />
                ) : searchTerm ? (
                  <div className="no-results-container">
                    <Typography className="no-results-message">
                      {t("matchmaking.playerSelection.noPlayersMatch")}
                    </Typography>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </form>
      {error && <p className="status-error error-message">{error}</p>}
    </div>
  );
}
