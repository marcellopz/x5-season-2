import React, { useContext, useEffect, useState } from "react";
import { MatchMakingContext } from "../context/matchMakingContext";
import {
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Collapse,
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material";
import { Settings as SettingsIcon, Add, Remove } from "@mui/icons-material";
import "./algorithmSelectionStep.css";

const formAlgos = {
  cheezeV1: {
    label: "Cheeze-v1",
    description:
      "First matchmaking algorithm, tries to make a fair match with same ranks accross all lanes",
    fields: [
      {
        id: "numberOfMatches",
        label: "Number of options",
        type: "number",
        initialValue: 5,
      },
    ],
  },
  cheezeV2: {
    label: "Cheeze-v2",
    description:
      "Matchmaking algorithm with tolerance, tries to make a fair match with allowed rank gaps within the tolerance",
    fields: [
      {
        id: "numberOfMatches",
        label: "Number of options",
        type: "number",
      },
      {
        id: "tolerance",
        label: "Tolerance",
        type: "number",
      },
      {
        id: "preset",
        label: "Preset roles",
        type: "preset",
      },
    ],
  },
  claudeV1: {
    label: "Claude-v1",
    description:
      "Balances teams based on players' average ranks, creating teams with similar total strength",
    fields: [
      {
        id: "numberOfMatches",
        label: "Number of options",
        type: "number",
      },
    ],
  },
  grilhaV1: {
    label: "Grilha-v1",
    description:
      "Generates match options that assign players to a broader range of roles, promoting diversity in lane assignments while ensuring fair matches within the specified tolerance.",
    fields: [
      {
        id: "numberOfMatches",
        label: "Number of options",
        type: "number",
      },
      {
        id: "tolerance",
        label: "Tolerance",
        type: "number",
      },
    ],
  },
};

const algos = ["", ...Object.keys(formAlgos)];

const getField = (
  field,
  selectedOptions,
  players,
  values,
  setValues,
  presetPositions,
  handlePresetChange,
  handleToleranceIncrement,
  handleToleranceDecrement,
  handleNumberOfMatchesIncrement,
  handleNumberOfMatchesDecrement
) => {
  if (field.type === "number") {
    const isToleranceField = field.id === "tolerance";
    const isNumberOfMatchesField = field.id === "numberOfMatches";
    const hasButtons = isToleranceField || isNumberOfMatchesField;

    return (
      <div className="algorithm-field-container">
        <InputLabel className="algorithm-label">{field.label}</InputLabel>
        <TextField
          type="number"
          value={values[field.id] ?? ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
          }
          className="algorithm-text-field"
          inputProps={{ min: isNumberOfMatchesField ? 1 : 0, step: 1 }}
          size="small"
          fullWidth
          InputProps={
            hasButtons
              ? {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={
                          isToleranceField
                            ? handleToleranceDecrement
                            : handleNumberOfMatchesDecrement
                        }
                        size="small"
                        edge="start"
                      >
                        <Remove />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={
                          isToleranceField
                            ? handleToleranceIncrement
                            : handleNumberOfMatchesIncrement
                        }
                        size="small"
                        edge="end"
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      </div>
    );
  }
  if (field.type === "preset") {
    return (
      <div className="preset-field-container">
        <InputLabel className="algorithm-label preset-label">
          Pre-set lanes
        </InputLabel>
        <Grid
          className="preset-lanes-container"
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {["Top", "Jungle", "Mid", "Adc", "Support"].map((lane, laneIndex) => {
            const laneProps = ["top", "jungle", "mid", "adc", "support"];
            const laneProp = laneProps[laneIndex];

            return (
              <React.Fragment key={lane}>
                <Grid item xs={3} className="preset-lane-label">
                  <p>{lane}</p>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    className="preset-select"
                    fullWidth
                    value={presetPositions[lane][0]}
                    onChange={(e) =>
                      handlePresetChange(e.target.value, lane, 0)
                    }
                  >
                    {["", ...selectedOptions].map((player) => (
                      <MenuItem value={player} key={player}>
                        {player === ""
                          ? "-"
                          : `${players[player]?.name} (${players[player]?.[laneProp]})`}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={1} className="lane-vs-label">
                  <p>vs</p>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    className="preset-select"
                    fullWidth
                    value={presetPositions[lane][1]}
                    onChange={(e) =>
                      handlePresetChange(e.target.value, lane, 1)
                    }
                  >
                    {["", ...selectedOptions].map((player) => (
                      <MenuItem value={player} key={player}>
                        {player === ""
                          ? "-"
                          : `${players[player]?.name} (${players[player]?.[laneProp]})`}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </div>
    );
  }
};

export default function AlgorithmSelectionStep({ setIsOk }) {
  const [error, setError] = useState("");
  const [values, setValues] = useState({ numberOfMatches: 5, tolerance: 1 });
  const {
    selectedOptions,
    selectedAlgo,
    setSelectedAlgo,
    setAlgoOptions,
    players,
  } = useContext(MatchMakingContext);
  const [presetPositions, setPresetPositions] = useState({
    Top: ["", ""],
    Jungle: ["", ""],
    Mid: ["", ""],
    Adc: ["", ""],
    Support: ["", ""],
  });

  // New state for simplified interface
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useRoleBalancing, setUseRoleBalancing] = useState(true);
  const [usePresetLanes, setUsePresetLanes] = useState(false);
  const [randomizeSides, setRandomizeSides] = useState(true);

  const MAX_NUMBER_OF_MATCHES = 15;

  const handleAlgoSelect = (e) => {
    setSelectedAlgo(e.target.value);
  };

  const handlePresetChange = (value, position, side) => {
    setPresetPositions((prev) => ({
      ...prev,
      [position]:
        side === 0 ? [value, prev[position][1]] : [prev[position][0], value],
    }));
  };

  const handleToleranceIncrement = () => {
    setValues((prev) => ({
      ...prev,
      tolerance: Math.max(0, (parseFloat(prev.tolerance) || 0) + 1),
    }));
  };

  const handleToleranceDecrement = () => {
    setValues((prev) => ({
      ...prev,
      tolerance: Math.max(0, (parseFloat(prev.tolerance) || 0) - 1),
    }));
  };

  const handleNumberOfMatchesIncrement = () => {
    setValues((prev) => ({
      ...prev,
      numberOfMatches: Math.max(1, (parseFloat(prev.numberOfMatches) || 0) + 1),
    }));
  };

  const handleNumberOfMatchesDecrement = () => {
    setValues((prev) => ({
      ...prev,
      numberOfMatches: Math.max(1, (parseFloat(prev.numberOfMatches) || 0) - 1),
    }));
  };

  // Auto-select algorithm based on simplified settings
  useEffect(() => {
    if (!showAdvanced) {
      if (useRoleBalancing) {
        if (usePresetLanes) {
          setSelectedAlgo("cheezeV2");
        } else {
          setSelectedAlgo("grilhaV1");
        }
      } else {
        setSelectedAlgo("claudeV1");
      }
    }
  }, [showAdvanced, useRoleBalancing, usePresetLanes, setSelectedAlgo]);

  useEffect(() => {
    setAlgoOptions({ options: values, presetPositions, randomizeSides });
    switch (selectedAlgo) {
      case "cheezeV1":
        if (!(+values.numberOfMatches > 0)) {
          setError("Choose how many matches to generate");
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            `Too many matches! The maximum is ${MAX_NUMBER_OF_MATCHES}.`
          );
          break;
        }
        setError(false);
        break;
      case "cheezeV2":
        if (!(values.numberOfMatches > 0)) {
          setError("Choose how many matches to generate");
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            `Too many matches! The maximum is ${MAX_NUMBER_OF_MATCHES}.`
          );
          break;
        }
        if (!(values.tolerance >= 0)) {
          setError("Choose a value for the tolerance");
          break;
        }
        const allPreset = [
          ...presetPositions.Top,
          ...presetPositions.Jungle,
          ...presetPositions.Mid,
          ...presetPositions.Adc,
          ...presetPositions.Support,
        ].filter((a) => a !== "");
        if (new Set(allPreset).size !== allPreset.length) {
          setError("You've chosen one player for multiple roles");
          break;
        }
        setError(false);
        break;
      case "claudeV1":
        if (!(values.numberOfMatches > 0)) {
          setError("Choose how many matches to generate");
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            `Too many matches! The maximum is ${MAX_NUMBER_OF_MATCHES}.`
          );
          break;
        }
        setError(false);
        break;
      case "grilhaV1":
        if (!(values.numberOfMatches > 0)) {
          setError("Choose how many matches to generate");
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            `Too many matches! The maximum is ${MAX_NUMBER_OF_MATCHES}.`
          );
          break;
        }
        if (!(values.tolerance >= 0)) {
          setError("Choose a value for the tolerance");
          break;
        }
        setError(false);
        break;
      case "":
        setError("Choose an algorithm for balancing the match");
        break;
      default:
        setError("Unknown algorithm selected");
        break;
    }
  }, [
    selectedAlgo,
    presetPositions,
    values,
    setAlgoOptions,
    MAX_NUMBER_OF_MATCHES,
    randomizeSides,
  ]);

  useEffect(() => {
    setIsOk(!error);
  }, [error, setIsOk]);

  // Reset preset positions when usePresetLanes is turned off
  useEffect(() => {
    if (!usePresetLanes) {
      setPresetPositions({
        Top: ["", ""],
        Jungle: ["", ""],
        Mid: ["", ""],
        Adc: ["", ""],
        Support: ["", ""],
      });
    }
  }, [usePresetLanes]);

  return (
    <div className="algorithm-selection-form">
      <Box className="title-container">
        <Typography className="algorithm-selection-title">
          Matchmaking Options
        </Typography>
        <IconButton
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="advanced-settings-icon"
          size="small"
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      <Collapse in={showAdvanced}>
        <div className="advanced-options">
          <Typography className="algorithm-selection-title">
            Select the matchmaking algorithm
          </Typography>
          <InputLabel id="algo-select" className="algorithm-label">
            Algorithm
          </InputLabel>
          <Select
            labelId="algo-select"
            value={selectedAlgo}
            label="Algorithm"
            onChange={handleAlgoSelect}
            placeholder="Algorithm"
            className="algorithm-select"
            fullWidth
          >
            {algos.map((algo) => (
              <MenuItem value={algo} key={algo}>
                <ListItemText
                  primary={formAlgos[algo]?.label ?? "-"}
                  secondary={formAlgos[algo]?.description ?? ""}
                />
              </MenuItem>
            ))}
          </Select>
          {selectedAlgo && (
            <Typography className="algorithm-selection-description">
              {formAlgos[selectedAlgo].description}
            </Typography>
          )}
          {selectedAlgo && (
            <div className="algorithm-fields-wrapper">
              {formAlgos[selectedAlgo].fields
                .filter((field) => field.type === "number")
                .map((selected) => (
                  <React.Fragment key={selected.label ?? selected.id}>
                    {getField(
                      selected,
                      selectedOptions,
                      players,
                      values,
                      setValues,
                      presetPositions,
                      handlePresetChange,
                      handleToleranceIncrement,
                      handleToleranceDecrement,
                      handleNumberOfMatchesIncrement,
                      handleNumberOfMatchesDecrement
                    )}
                  </React.Fragment>
                ))}
            </div>
          )}
          {selectedAlgo &&
            formAlgos[selectedAlgo].fields
              .filter((field) => field.type === "preset")
              .map((selected) => (
                <React.Fragment key={selected.label ?? selected.id}>
                  {getField(
                    selected,
                    selectedOptions,
                    players,
                    values,
                    setValues,
                    presetPositions,
                    handlePresetChange,
                    handleToleranceIncrement,
                    handleToleranceDecrement,
                    handleNumberOfMatchesIncrement,
                    handleNumberOfMatchesDecrement
                  )}
                </React.Fragment>
              ))}

          {/* Randomize sides checkbox for advanced options - only shown when preset lanes are configured */}
          {selectedAlgo &&
            formAlgos[selectedAlgo].fields.some(
              (field) => field.type === "preset"
            ) && (
              <div
                className="algorithm-field-container"
                style={{ marginTop: "20px" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={randomizeSides}
                      onChange={(e) => setRandomizeSides(e.target.checked)}
                    />
                  }
                  label="Randomize sides"
                  className="algorithm-checkbox"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "primary.dark",
                    },
                  }}
                />
              </div>
            )}
        </div>
      </Collapse>

      <Collapse in={!showAdvanced}>
        <div className="simplified-options">
          {/* Use role balancing checkbox */}
          <div className="algorithm-field-container">
            <FormControlLabel
              control={
                <Checkbox
                  checked={useRoleBalancing}
                  onChange={(e) => setUseRoleBalancing(e.target.checked)}
                />
              }
              label="Use role balancing"
              className="algorithm-checkbox"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "primary.dark",
                },
              }}
            />
          </div>

          {/* Options only shown when role balancing is on */}
          {useRoleBalancing && (
            <>
              {/* Tolerance and Number of options side by side */}
              <div className="algorithm-fields-wrapper">
                <div className="algorithm-field-container">
                  <InputLabel className="algorithm-label">
                    Number of options
                  </InputLabel>
                  <TextField
                    type="number"
                    value={values.numberOfMatches ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        numberOfMatches: e.target.value,
                      }))
                    }
                    className="algorithm-text-field"
                    inputProps={{ min: 1, step: 1 }}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={handleNumberOfMatchesDecrement}
                            size="small"
                            edge="start"
                          >
                            <Remove />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleNumberOfMatchesIncrement}
                            size="small"
                            edge="end"
                          >
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="algorithm-field-container">
                  <InputLabel className="algorithm-label">Tolerance</InputLabel>
                  <TextField
                    type="number"
                    value={values.tolerance ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        tolerance: e.target.value,
                      }))
                    }
                    className="algorithm-text-field"
                    inputProps={{ min: 0, step: 1 }}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={handleToleranceDecrement}
                            size="small"
                            edge="start"
                          >
                            <Remove />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToleranceIncrement}
                            size="small"
                            edge="end"
                          >
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Pre-set lanes checkbox */}
              <div className="algorithm-field-container">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={usePresetLanes}
                      onChange={(e) => setUsePresetLanes(e.target.checked)}
                    />
                  }
                  label="Use pre-set lanes"
                  className="algorithm-checkbox"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "primary.dark",
                    },
                  }}
                />
              </div>

              {/* Pre-set lanes configuration */}
              {usePresetLanes && (
                <div className="preset-field-container">
                  <InputLabel className="algorithm-label preset-label">
                    Pre-set lanes
                  </InputLabel>
                  <Grid
                    className="preset-lanes-container"
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    {["Top", "Jungle", "Mid", "Adc", "Support"].map(
                      (lane, laneIndex) => {
                        const laneProps = [
                          "top",
                          "jungle",
                          "mid",
                          "adc",
                          "support",
                        ];
                        const laneProp = laneProps[laneIndex];

                        return (
                          <React.Fragment key={lane}>
                            <Grid item xs={3} className="preset-lane-label">
                              <p>{lane}</p>
                            </Grid>
                            <Grid item xs={4}>
                              <Select
                                className="preset-select"
                                fullWidth
                                value={presetPositions[lane][0]}
                                onChange={(e) =>
                                  handlePresetChange(e.target.value, lane, 0)
                                }
                              >
                                {["", ...selectedOptions].map((player) => (
                                  <MenuItem value={player} key={player}>
                                    {player === ""
                                      ? "-"
                                      : `${players[player]?.name} (${players[player]?.[laneProp]})`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                            <Grid item xs={1} className="lane-vs-label">
                              <p>vs</p>
                            </Grid>
                            <Grid item xs={4}>
                              <Select
                                className="preset-select"
                                fullWidth
                                value={presetPositions[lane][1]}
                                onChange={(e) =>
                                  handlePresetChange(e.target.value, lane, 1)
                                }
                              >
                                {["", ...selectedOptions].map((player) => (
                                  <MenuItem value={player} key={player}>
                                    {player === ""
                                      ? "-"
                                      : `${players[player]?.name} (${players[player]?.[laneProp]})`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                          </React.Fragment>
                        );
                      }
                    )}
                  </Grid>

                  {/* Randomize sides checkbox - positioned after preset lanes configuration */}
                  <div
                    className="algorithm-field-container"
                    style={{ marginTop: "20px" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={randomizeSides}
                          onChange={(e) => setRandomizeSides(e.target.checked)}
                        />
                      }
                      label="Randomize sides"
                      className="algorithm-checkbox"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "primary.dark",
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Number of options - shown when role balancing is off */}
          {!useRoleBalancing && (
            <div className="algorithm-field-container">
              <InputLabel className="algorithm-label">
                Number of options
              </InputLabel>
              <TextField
                type="number"
                value={values.numberOfMatches ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    numberOfMatches: e.target.value,
                  }))
                }
                className="algorithm-text-field"
                inputProps={{ min: 1, step: 1 }}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={handleNumberOfMatchesDecrement}
                        size="small"
                        edge="start"
                      >
                        <Remove />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleNumberOfMatchesIncrement}
                        size="small"
                        edge="end"
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}
        </div>
      </Collapse>

      {error && <Typography className="error-message">{error}</Typography>}
    </div>
  );
}
