import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { MatchMakingContext } from "../context/matchMakingContext";
import { Button, IconButton, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme";
import { executeBalance } from "./balanceService";
import "./resultStep.css";

const roles = ["Top", "Jungle", "Mid", "Adc", "Support"];

const buildLine = (matchup) => {
  return `${matchup[0].name.padStart(10, " ")} (${matchup[0].rank}) x (${
    matchup[1].rank
  }) ${matchup[1].name}`;
};

const getCopyPasteText = (matchups, t) => {
  let string = "";
  matchups.forEach((match, i) => {
    string += t("matchmaking.results.match", { number: i + 1 }) + "\n";

    // Check if it's claudeV1 algorithm result
    if (match.teams) {
      // Sort teams by average rank for better readability
      const sortedBlueTeam = [...match.teams.blue].sort(
        (a, b) => b.avgRank - a.avgRank
      );
      const sortedRedTeam = [...match.teams.red].sort(
        (a, b) => b.avgRank - a.avgRank
      );

      // For claudeV1, show player list with average ranks
      for (let j = 0; j < 5; j++) {
        const bluePlayer = sortedBlueTeam[j];
        const redPlayer = sortedRedTeam[j];
        string += `${j + 1 + ":"} ${bluePlayer.name.padStart(
          10,
          " "
        )} (${bluePlayer.avgRank.toFixed(1)}) x (${redPlayer.avgRank.toFixed(
          1
        )}) ${redPlayer.name}\n`;
      }
      string += `${t(
        "matchmaking.results.score"
      )} ${match.matchScore.blue.toFixed(1)} x ${match.matchScore.red.toFixed(
        1
      )} -> ${(match.matchScore.blue + match.matchScore.red).toFixed(1)}\n`;
      string += `${t("matchmaking.results.difference")} ${Math.abs(
        match.matchScore.blue - match.matchScore.red
      ).toFixed(1)}\n\n`;
    } else {
      // Original format for cheezeV1 and cheezeV2
      string += `Top: ${buildLine(match.pairingsRoles.Top)}\n`;
      string += `Jng: ${buildLine(match.pairingsRoles.Jungle)}\n`;
      string += `Mid: ${buildLine(match.pairingsRoles.Mid)}\n`;
      string += `Adc: ${buildLine(match.pairingsRoles.Adc)}\n`;
      string += `Sup: ${buildLine(match.pairingsRoles.Support)}\n`;
      string += `${t("matchmaking.results.score")} ${match.matchScore.blue} x ${
        match.matchScore.red
      } -> ${match.matchScore.blue + match.matchScore.red}\n\n`;
    }
  });

  return string;
};

const ResultComponent = ({ match }) => {
  const { t } = useTranslation();
  // Check if the match is using claudeV1 algorithm (has teams property)
  const isClaudeV1 = match.teams !== undefined;

  if (isClaudeV1) {
    // For claudeV1, display by average rank rather than roles
    // Sort blue and red teams by average rank (highest to lowest)
    const sortedBlueTeam = [...match.teams.blue].sort(
      (a, b) => b.avgRank - a.avgRank
    );
    const sortedRedTeam = [...match.teams.red].sort(
      (a, b) => b.avgRank - a.avgRank
    );

    return (
      <div className="mm-rs-container">
        <ul className="mm-rs-list">
          {sortedBlueTeam.map((bluePlayer, i) => {
            const redPlayer = sortedRedTeam[i];
            return (
              <li
                key={i}
                className={`mm-rs-list-item ${
                  i % 2 === 0 ? "mm-rs-list-item-even" : "mm-rs-list-item-odd"
                }`}
              >
                <div className="mm-rs-role-label">{i + 1}</div>
                <div className="mm-rs-player-name">{bluePlayer.name}</div>
                <div className="mm-rs-player-rank-claude">{`(${bluePlayer.avgRank.toFixed(
                  1
                )})`}</div>
                <div>{t("common.vs")}</div>
                <div className="mm-rs-vs-divider">{`(${redPlayer.avgRank.toFixed(
                  1
                )})`}</div>
                <div className="mm-rs-opponent-name">{redPlayer.name}</div>
              </li>
            );
          })}
          <li
            className="mm-rs-list-item mm-rs-scores-item"
            style={{ backgroundColor: theme.palette.secondary.main }}
          >
            <div className="mm-rs-scores-label">{t("common.scores")}</div>
            <div className="mm-rs-blue-score">
              {match.matchScore.blue.toFixed(1)}
            </div>
            <div>-</div>
            <div className="mm-rs-red-score">
              {match.matchScore.red.toFixed(1)}
            </div>
          </li>
          <li
            className="mm-rs-list-item mm-rs-total-item"
            style={{ backgroundColor: theme.palette.secondary.dark }}
          >
            <div className="mm-rs-total-label">
              {t("matchmaking.results.total")}
            </div>
            <div className="mm-rs-total-value">
              {(match.matchScore.blue + match.matchScore.red).toFixed(1)}
            </div>
          </li>
          <li
            className="mm-rs-list-item mm-rs-diff-item"
            style={{ backgroundColor: theme.palette.secondary.main }}
          >
            <div className="mm-rs-diff-label">
              {t("matchmaking.results.diff")}
            </div>
            <div className="mm-rs-diff-value">
              {Math.abs(match.matchScore.blue - match.matchScore.red).toFixed(
                1
              )}
            </div>
          </li>
        </ul>
      </div>
    );
  }

  // Original layout for cheezeV1 and cheezeV2
  return (
    <div className="mm-rs-container">
      <ul className="mm-rs-list">
        {roles.map((role, i) => {
          return (
            <li
              key={i}
              className={`mm-rs-list-item ${
                i % 2 === 0 ? "mm-rs-list-item-even" : "mm-rs-list-item-odd"
              }`}
            >
              <div className="mm-rs-role-label">{role}</div>
              <div className="mm-rs-player-name">
                {match.pairingsRoles[role][0].name}
              </div>
              <div className="mm-rs-player-rank">{`(${match.pairingsRoles[role][0].rank})`}</div>
              <div>{t("common.vs")}</div>
              <div className="mm-rs-vs-divider">{`(${match.pairingsRoles[role][1].rank})`}</div>
              <div className="mm-rs-opponent-name">
                {match.pairingsRoles[role][1].name}
              </div>
            </li>
          );
        })}
        <li
          className="mm-rs-list-item mm-rs-scores-item"
          style={{ backgroundColor: theme.palette.secondary.main }}
        >
          <div className="mm-rs-scores-label">{t("common.scores")}</div>
          <div className="mm-rs-blue-score">{match.matchScore.blue}</div>
          <div>-</div>
          <div className="mm-rs-red-score">{match.matchScore.red}</div>
        </li>
        <li
          className="mm-rs-list-item mm-rs-total-item"
          style={{ backgroundColor: theme.palette.secondary.dark }}
        >
          <div className="mm-rs-total-label">{t("common.total")}</div>
          <div className="mm-rs-total-value">
            {match.matchScore.blue + match.matchScore.red}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default function ResultStep() {
  const { t } = useTranslation();
  const {
    players,
    algoOptions,
    selectedOptions,
    selectedAlgo,
    wildcardDetails,
  } = useContext(MatchMakingContext);
  const [matchups, setMatchups] = useState([]);
  const [copyPastText, setCopyPasteText] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const playersToBalance = useMemo(() => {
    return [
      ...selectedOptions.map((player) => ({
        name: players[player].name,
        ranks: [
          players[player].top,
          players[player].jungle,
          players[player].mid,
          players[player].adc,
          players[player].support,
        ],
        playerId: player,
      })),
      ...wildcardDetails.map((player) => ({
        name: player.name,
        ranks: [
          player.top,
          player.jungle,
          player.mid,
          player.adc,
          player.support,
        ],
        playerId: player.name,
      })),
    ];
  }, [selectedOptions, players, wildcardDetails]);

  const balance = useCallback(() => {
    executeBalance(playersToBalance, algoOptions, selectedAlgo, {
      setIsLoading,
      setError,
      setMatchups,
    });
  }, [playersToBalance, algoOptions, selectedAlgo]);

  useEffect(() => {
    if (playersToBalance?.length) {
      balance();
    }
  }, [playersToBalance, balance]);

  useEffect(() => {
    if (matchups && matchups.length > 0) {
      setCopyPasteText(getCopyPasteText(matchups, t));
    }
  }, [matchups, t]);

  return (
    <div>
      <div className="mm-rs-main-controls">
        <div className="mm-rs-controls-container">
          <Button
            variant="outlined"
            onClick={() => balance()}
            className="mm-rs-reroll-button"
            disabled={isLoading}
          >
            {isLoading
              ? t("matchmaking.results.generating")
              : t("matchmaking.results.reroll")}
          </Button>
          {matchups && matchups.length > 0 && (
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(copyPastText);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          )}
        </div>
      </div>

      {error && (
        <div className="mm-rs-error-container">
          <div className="mm-rs-error-content">
            <h3>{t("matchmaking.results.noMatchesFound")}</h3>
            <p>{error}</p>
            <p className="mm-rs-error-suggestions">
              {t("matchmaking.results.suggestions")}
              <br />• {t("matchmaking.results.suggestionsList.0")}
              <br />• {t("matchmaking.results.suggestionsList.1")}
              <br />• {t("matchmaking.results.suggestionsList.2")}
              <br />• {t("matchmaking.results.suggestionsList.3")}
            </p>
          </div>
        </div>
      )}

      {matchups && matchups.length > 0 && (
        <div className="mm-rs-results-container">
          <div className="mm-rs-results-column">
            {matchups.map((match, i) => (
              <ResultComponent key={i} match={match} />
            ))}
          </div>
          <TextField
            value={copyPastText}
            multiline
            className="mm-rs-textfield"
            inputProps={{
              className: "mm-rs-textfield-input",
            }}
          />
        </div>
      )}
    </div>
  );
}
