import React, { useContext, useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { List } from "@mui/icons-material";
import { theme } from "../../../theme";

const columns = [
  {
    field: "name",
    headerName: "Name",
    type: "string",
    width: 120,
    sortable: true,
  },
  {
    field: "top",
    headerName: "Top",
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "jungle",
    headerName: "Jungle",
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "mid",
    headerName: "Mid",
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "adc",
    headerName: "Adc",
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
  {
    field: "support",
    headerName: "Support",
    type: "number",
    width: 80,
    flex: 1,
    sortable: true,
  },
];

const WildcardCard = ({ id, wildcardDetails, setWildcardDetails }) => {
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
    <div
      style={{
        width: "200px",
        height: "300px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        border: isValid ? "1px solid green" : "1px solid red",
        padding: "16px",
        gap: "12px",
      }}
    >
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography width={60}>Name:</Typography>
        <TextField
          required
          name="name"
          size="small"
          type="text"
          inputProps={{
            sx: {
              textAlign: "center",
              height: "20px",
            },
          }}
          sx={{
            width: "100px",
          }}
          value={wildcardDetails[id]?.name || ""}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography width={60}>Top:</Typography>
        <TextField
          required
          name="top"
          size="small"
          type="number"
          inputProps={{
            sx: {
              textAlign: "center",
              height: "20px",
            },
          }}
          sx={{
            width: "60px",
          }}
          value={wildcardDetails[id]?.top || ""}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography width={60}>Jungle:</Typography>
        <TextField
          required
          name="jungle"
          size="small"
          type="number"
          inputProps={{
            sx: {
              textAlign: "center",
              height: "20px",
            },
          }}
          sx={{
            width: "60px",
          }}
          value={wildcardDetails[id]?.jungle || ""}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography width={60}>Mid:</Typography>
        <TextField
          required
          name="mid"
          size="small"
          type="number"
          inputProps={{
            sx: {
              textAlign: "center",
              height: "20px",
            },
          }}
          sx={{
            width: "60px",
          }}
          value={wildcardDetails[id]?.mid || ""}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography width={60}>Adc:</Typography>
        <TextField
          required
          name="adc"
          size="small"
          type="number"
          inputProps={{
            sx: {
              textAlign: "center",
              height: "20px",
            },
          }}
          sx={{
            width: "60px",
          }}
          value={wildcardDetails[id]?.adc || ""}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography width={60}>Support:</Typography>
        <TextField
          required
          name="support"
          size="small"
          type="number"
          inputProps={{
            sx: {
              textAlign: "center",
              height: "20px",
            },
          }}
          sx={{
            width: "60px",
          }}
          value={wildcardDetails[id]?.support || ""}
          onChange={handleChange}
        />
      </Box>
    </div>
  );
};

export default function PlayerSelectionStep({ setIsOk }) {
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

  const arrayOfPlayers =
    Object.keys(players ?? {}).map((player, i) => ({
      ...players[player],
      id: i,
      player_id: player,
    })) ?? [];

  useEffect(() => {
    setIsOk(!error);
  }, [error, setIsOk]);

  return (
    <div>
      <div
        style={{
          marginLeft: "20px",
          display: "inline-flex",
          position: "relative",
          width: "100%",
        }}
      >
        <div>
          <p style={{ color: theme.palette.text.primary }}>
            Select the players for the match
          </p>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <p
              style={{
                color: error
                  ? theme.palette.error.light
                  : theme.palette.success.main,
              }}
            >
              {selectedOptions.length +
                wildcardDetails?.filter(isWildcardValid).length}{" "}
              valid players selected
            </p>
            {error && (
              <p style={{ color: theme.palette.error.light }}>- {error}</p>
            )}
          </Box>
        </div>
        <IconButton
          style={{ position: "absolute", right: "40px", top: "30px" }}
          onClick={() => setDisplayCard((prev) => !prev)}
        >
          <List />
        </IconButton>
      </div>

      <form>
        <Box sx={{ margin: "10px 20px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography>Number of wildcards:</Typography>
            <Button
              variant="outlined"
              sx={{
                width: "40px",
                minWidth: "40px",
              }}
              onClick={() => {
                if (numberOfWildcards < 10) {
                  setNumberOfWildcards((prev) => prev + 1);
                }
              }}
            >
              +
            </Button>
            <TextField
              size="small"
              type="number"
              inputProps={{
                sx: {
                  textAlign: "center",
                  height: "20px",
                },
              }}
              sx={{
                width: "50px",
              }}
              value={numberOfWildcards}
            />
            <Button
              variant="outlined"
              sx={{
                width: "40px",
                minWidth: "40px",
              }}
              onClick={() => {
                if (numberOfWildcards > 0) {
                  setNumberOfWildcards((prev) => prev - 1);
                }
              }}
            >
              -
            </Button>
          </Box>
          {numberOfWildcards > 0 && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
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
        </Box>
        {displayCard && (
          <div
            style={{
              margin: "10px",
              backgroundColor: "black",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
              padding: "20px",
              borderRadius: "20px",
              justifyItems: "center",
              alignItems: "start",
              minHeight: "800px",
            }}
          >
            {cards.map((card) => (
              <Box
                key={card.name}
                onClick={() => handleOptionChange(card.name)}
                sx={{
                  "&:hover": {
                    border: "1px solid " + theme.palette.primary.main,
                    cursor: "pointer",
                  },
                  border: "1px solid",
                  borderColor: selectedOptions.includes(card.name)
                    ? theme.palette.primary.dark
                    : "black",
                }}
                style={{
                  padding: "5px",
                  justifyContent: "center",
                  borderRadius: "5px",
                  display: cards.length > cardReadyCounter ? "none" : "block",
                  width: "230px",
                }}
              >
                <div style={{ height: "300px" }}>{card.card}</div>
              </Box>
            ))}
            {cards.length > cardReadyCounter && (
              <CircularProgress
                sx={{ marginTop: "50px", marginBottom: "900px" }}
              />
            )}
          </div>
        )}
        {!displayCard && (
          <div
            style={{
              maxWidth: "900px",
              width: "95%",
              margin: "auto",
            }}
          >
            {players && (
              <DataGrid
                rows={arrayOfPlayers}
                columns={columns}
                density="compact"
                checkboxSelection
                hideFooter
                onRowSelectionModelChange={(a) =>
                  setSelectedOptions(a.map((b) => arrayOfPlayers[b].player_id))
                }
                rowSelectionModel={selectedOptions.map((a) =>
                  Object.keys(players).indexOf(a)
                )}
                sx={{
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                    {
                      display: "none",
                    },
                }}
              />
            )}
          </div>
        )}
      </form>
      {error && (
        <p style={{ color: theme.palette.error.light, marginLeft: "20px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
