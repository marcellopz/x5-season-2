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
import { useTranslation } from "react-i18next";
import "./algorithmSelectionStep.css";

const getFormAlgos = (t) => ({
  cheezeV1: {
    label: t("matchmaking.algorithmSelection.algorithms.cheezeV1.label"),
    description: t(
      "matchmaking.algorithmSelection.algorithms.cheezeV1.description"
    ),
    fields: [
      {
        id: "numberOfMatches",
        label: t("matchmaking.algorithmSelection.numberOfOptions"),
        type: "number",
        initialValue: 5,
      },
    ],
  },
  cheezeV2: {
    label: t("matchmaking.algorithmSelection.algorithms.cheezeV2.label"),
    description: t(
      "matchmaking.algorithmSelection.algorithms.cheezeV2.description"
    ),
    fields: [
      {
        id: "numberOfMatches",
        label: t("matchmaking.algorithmSelection.numberOfOptions"),
        type: "number",
      },
      {
        id: "tolerance",
        label: t("matchmaking.algorithmSelection.tolerance"),
        type: "number",
      },
      {
        id: "preset",
        label: t("matchmaking.algorithmSelection.presetRoles"),
        type: "preset",
      },
    ],
  },
  claudeV1: {
    label: t("matchmaking.algorithmSelection.algorithms.claudeV1.label"),
    description: t(
      "matchmaking.algorithmSelection.algorithms.claudeV1.description"
    ),
    fields: [
      {
        id: "numberOfMatches",
        label: t("matchmaking.algorithmSelection.numberOfOptions"),
        type: "number",
      },
    ],
  },
  grilhaV1: {
    label: t("matchmaking.algorithmSelection.algorithms.grilhaV1.label"),
    description: t(
      "matchmaking.algorithmSelection.algorithms.grilhaV1.description"
    ),
    fields: [
      {
        id: "numberOfMatches",
        label: t("matchmaking.algorithmSelection.numberOfOptions"),
        type: "number",
      },
      {
        id: "tolerance",
        label: t("matchmaking.algorithmSelection.tolerance"),
        type: "number",
      },
    ],
  },
});

const getAlgos = (formAlgos) => ["", ...Object.keys(formAlgos)];

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
  handleNumberOfMatchesDecrement,
  t
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
          {t("matchmaking.algorithmSelection.presetLanes")}
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
                  <p>{t("common.vs")}</p>
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
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [values, setValues] = useState({ numberOfMatches: 5, tolerance: 1 });
  const {
    selectedOptions,
    selectedAlgo,
    setSelectedAlgo,
    setAlgoOptions,
    players,
  } = useContext(MatchMakingContext);

  const formAlgos = getFormAlgos(t);
  const algos = getAlgos(formAlgos);
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
  const [useHalfSupportRank, setUseHalfSupportRank] = useState(false);

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
      if (useHalfSupportRank) {
        setSelectedAlgo("cheezeV2");
      } else if (useRoleBalancing) {
        if (usePresetLanes) {
          setSelectedAlgo("cheezeV2");
        } else {
          setSelectedAlgo("grilhaV1");
        }
      } else {
        setSelectedAlgo("claudeV1");
      }
    }
  }, [
    showAdvanced,
    useRoleBalancing,
    usePresetLanes,
    useHalfSupportRank,
    setSelectedAlgo,
  ]);

  useEffect(() => {
    setAlgoOptions({
      options: values,
      presetPositions,
      randomizeSides,
      useHalfSupportRank,
    });
    switch (selectedAlgo) {
      case "cheezeV1":
        if (!(+values.numberOfMatches > 0)) {
          setError(t("matchmaking.algorithmSelection.errors.chooseMatches"));
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            t("matchmaking.algorithmSelection.errors.tooManyMatches", {
              max: MAX_NUMBER_OF_MATCHES,
            })
          );
          break;
        }
        setError(false);
        break;
      case "cheezeV2":
        if (!(values.numberOfMatches > 0)) {
          setError(t("matchmaking.algorithmSelection.errors.chooseMatches"));
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            t("matchmaking.algorithmSelection.errors.tooManyMatches", {
              max: MAX_NUMBER_OF_MATCHES,
            })
          );
          break;
        }
        if (!(values.tolerance >= 0)) {
          setError(t("matchmaking.algorithmSelection.errors.chooseTolerance"));
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
          setError(t("matchmaking.algorithmSelection.errors.duplicatePlayer"));
          break;
        }
        setError(false);
        break;
      case "claudeV1":
        if (!(values.numberOfMatches > 0)) {
          setError(t("matchmaking.algorithmSelection.errors.chooseMatches"));
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            t("matchmaking.algorithmSelection.errors.tooManyMatches", {
              max: MAX_NUMBER_OF_MATCHES,
            })
          );
          break;
        }
        setError(false);
        break;
      case "grilhaV1":
        if (!(values.numberOfMatches > 0)) {
          setError(t("matchmaking.algorithmSelection.errors.chooseMatches"));
          break;
        }
        if (values.numberOfMatches > MAX_NUMBER_OF_MATCHES) {
          setError(
            t("matchmaking.algorithmSelection.errors.tooManyMatches", {
              max: MAX_NUMBER_OF_MATCHES,
            })
          );
          break;
        }
        if (!(values.tolerance >= 0)) {
          setError(t("matchmaking.algorithmSelection.errors.chooseTolerance"));
          break;
        }
        setError(false);
        break;
      case "":
        setError(t("matchmaking.algorithmSelection.errors.chooseAlgorithm"));
        break;
      default:
        setError(t("matchmaking.algorithmSelection.errors.unknownAlgorithm"));
        break;
    }
  }, [
    selectedAlgo,
    presetPositions,
    values,
    setAlgoOptions,
    MAX_NUMBER_OF_MATCHES,
    randomizeSides,
    useHalfSupportRank,
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
          {t("matchmaking.algorithmSelection.title")}
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
            {t("matchmaking.algorithmSelection.selectAlgorithm")}
          </Typography>
          <InputLabel id="algo-select" className="algorithm-label">
            {t("matchmaking.algorithmSelection.algorithm")}
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
                      handleNumberOfMatchesDecrement,
                      t
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
                    handleNumberOfMatchesDecrement,
                    t
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
                  label={t("matchmaking.algorithmSelection.randomizeSides")}
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
              label={t("matchmaking.algorithmSelection.useRoleBalancing")}
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
                    {t("matchmaking.algorithmSelection.numberOfOptions")}
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
                  <InputLabel className="algorithm-label">
                    {t("matchmaking.algorithmSelection.tolerance")}
                  </InputLabel>
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
                  label={t("matchmaking.algorithmSelection.usePresetLanes")}
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
                    {t("matchmaking.algorithmSelection.presetLanes")}
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
                              <p>{t("common.vs")}</p>
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
                      label={t("matchmaking.algorithmSelection.randomizeSides")}
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

          {/* Use half support rank checkbox */}
          <div className="algorithm-field-container">
            <FormControlLabel
              control={
                <Checkbox
                  checked={useHalfSupportRank}
                  onChange={(e) => setUseHalfSupportRank(e.target.checked)}
                />
              }
              label={t("matchmaking.algorithmSelection.useHalfSupportRank")}
              className="algorithm-checkbox"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "primary.dark",
                },
              }}
            />
          </div>

          {/* Number of options - shown when role balancing is off */}
          {!useRoleBalancing && (
            <div className="algorithm-field-container">
              <InputLabel className="algorithm-label">
                {t("matchmaking.algorithmSelection.numberOfOptions")}
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
