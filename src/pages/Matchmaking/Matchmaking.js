import React, { useContext, useEffect, useState } from "react";
import { MatchMakingProvider } from "./context/matchMakingContext";
import PlayerSelectionStep from "./steps/playerSelectionStep";
import AlgorithmSelectionStep from "./steps/algorithmSelectionStep";
import ResultStep from "./steps/resultStep";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MiscContext } from "../../contexts/miscContext";
import X5pageContentArea from "../../common-components/X5pageContentArea";
import "./Matchmaking.css"; // Import component styles

export default function Matchmaking() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const { getCardbackground } = useContext(MiscContext);
  const [isOk, setIsOk] = useState(false);

  const stepTitles = [
    t("matchmaking.steps.selectPlayers"),
    t("matchmaking.steps.configureAlgorithm"),
    t("matchmaking.steps.results"),
  ];

  useEffect(() => {
    getCardbackground();
  }, [getCardbackground]);

  // Reset isOk state when step changes
  useEffect(() => {
    setIsOk(false);
  }, [step]);

  return (
    <MatchMakingProvider>
      <X5pageContentArea title={t("matchmaking.title")}>
        <div
          className="matchmaking-container"
          data-testid="matchmaking-container"
        >
          <div className="step-indicator" data-testid="step-indicator">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`step-dot ${step === index ? "active" : ""}`}
                data-testid="step-dot"
              />
            ))}
          </div>
          <Typography className="step-title" data-testid="step-title">
            {stepTitles[step]}
          </Typography>
          <div
            className="matchmaking-step-container"
            data-testid="matchmaking-step-container"
          >
            {step === 0 && <PlayerSelectionStep setIsOk={setIsOk} />}
            {step === 1 && <AlgorithmSelectionStep setIsOk={setIsOk} />}
            {step === 2 && <ResultStep />}
          </div>
          <div
            className="matchmaking-nav-buttons"
            data-testid="matchmaking-nav-buttons"
          >
            <Button
              className="matchmaking-button"
              variant="outlined"
              disabled={step === 0}
              onClick={() => setStep((prev) => prev - 1)}
            >
              {t("common.back")}
            </Button>
            <Button
              className="matchmaking-button"
              variant="outlined"
              disabled={step === 2 || !isOk}
              onClick={() => setStep((prev) => prev + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      </X5pageContentArea>
    </MatchMakingProvider>
  );
}
