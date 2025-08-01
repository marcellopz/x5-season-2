import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Matchmaking from "./Matchmaking";
import { MiscContext } from "../../contexts/miscContext";

// Mock dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "matchmaking.title": "Matchmaking",
        "matchmaking.steps.selectPlayers": "Select Players",
        "matchmaking.steps.configureAlgorithm": "Configure Algorithm",
        "matchmaking.steps.results": "Results",
        "common.back": "Back",
        "common.next": "Next",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../../common-components/X5pageContentArea", () => {
  return function MockX5pageContentArea({ children, title }) {
    return (
      <div data-testid="page-content-area" data-title={title}>
        {children}
      </div>
    );
  };
});

jest.mock("./context/matchMakingContext", () => ({
  MatchMakingProvider: ({ children }) => (
    <div data-testid="matchmaking-provider">{children}</div>
  ),
}));

jest.mock("./steps/playerSelectionStep", () => {
  return function MockPlayerSelectionStep({ setIsOk }) {
    return (
      <div data-testid="player-selection-step">
        <p>Player Selection Step</p>
        <button onClick={() => setIsOk(true)}>Enable Next</button>
        <button onClick={() => setIsOk(false)}>Disable Next</button>
      </div>
    );
  };
});

jest.mock("./steps/algorithmSelectionStep", () => {
  return function MockAlgorithmSelectionStep({ setIsOk }) {
    return (
      <div data-testid="algorithm-selection-step">
        <p>Algorithm Selection Step</p>
        <button onClick={() => setIsOk(true)}>Enable Next</button>
        <button onClick={() => setIsOk(false)}>Disable Next</button>
      </div>
    );
  };
});

jest.mock("./steps/resultStep", () => {
  return function MockResultStep() {
    return (
      <div data-testid="result-step">
        <p>Result Step</p>
      </div>
    );
  };
});

const theme = createTheme();

const mockMiscContext = {
  getCardbackground: jest.fn(),
};

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <MiscContext.Provider value={mockMiscContext}>
        {component}
      </MiscContext.Provider>
    </ThemeProvider>
  );
};

describe("Matchmaking Steps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Render", () => {
    test("should render matchmaking component with initial step", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("page-content-area")).toBeInTheDocument();
      expect(screen.getByTestId("matchmaking-provider")).toBeInTheDocument();
      expect(screen.getByText("Select Players")).toBeInTheDocument();
    });

    test("should start at step 0 (Player Selection)", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("player-selection-step")).toBeInTheDocument();
      expect(
        screen.queryByTestId("algorithm-selection-step")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("result-step")).not.toBeInTheDocument();
    });

    test("should call getCardbackground on mount", () => {
      renderWithProviders(<Matchmaking />);

      expect(mockMiscContext.getCardbackground).toHaveBeenCalled();
    });

    test("should render with correct page title", () => {
      renderWithProviders(<Matchmaking />);

      const pageContentArea = screen.getByTestId("page-content-area");
      expect(pageContentArea).toHaveAttribute("data-title", "Matchmaking");
    });
  });

  describe("Step Indicators", () => {
    test("should render all three step indicators", () => {
      renderWithProviders(<Matchmaking />);

      const stepDots = screen.getAllByTestId("step-dot");
      expect(stepDots).toHaveLength(3);
    });

    test("should highlight active step indicator", () => {
      renderWithProviders(<Matchmaking />);

      const stepDots = screen.getAllByTestId("step-dot");
      expect(stepDots[0]).toHaveClass("active");
      expect(stepDots[1]).not.toHaveClass("active");
      expect(stepDots[2]).not.toHaveClass("active");
    });

    test("should update active step indicator when navigating", () => {
      renderWithProviders(<Matchmaking />);

      // Enable next button and go to step 1
      const enableNextButton = screen.getByText("Enable Next");
      fireEvent.click(enableNextButton);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      const stepDots = screen.getAllByTestId("step-dot");
      expect(stepDots[0]).not.toHaveClass("active");
      expect(stepDots[1]).toHaveClass("active");
      expect(stepDots[2]).not.toHaveClass("active");
    });
  });

  describe("Step Navigation", () => {
    test("should display correct step title", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByText("Select Players")).toBeInTheDocument();
    });

    test("should navigate to next step when next button is clicked", () => {
      renderWithProviders(<Matchmaking />);

      // Enable next button first
      const enableNextButton = screen.getByText("Enable Next");
      fireEvent.click(enableNextButton);

      // Click next button
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      // Should now be on algorithm selection step
      expect(
        screen.getByTestId("algorithm-selection-step")
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("player-selection-step")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Configure Algorithm")).toBeInTheDocument();
    });

    test("should navigate to previous step when back button is clicked", () => {
      renderWithProviders(<Matchmaking />);

      // Navigate to step 1 first
      const enableNextButton = screen.getByText("Enable Next");
      fireEvent.click(enableNextButton);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      // Now go back
      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      // Should be back on player selection step
      expect(screen.getByTestId("player-selection-step")).toBeInTheDocument();
      expect(
        screen.queryByTestId("algorithm-selection-step")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Select Players")).toBeInTheDocument();
    });

    test("should navigate through all three steps", () => {
      renderWithProviders(<Matchmaking />);

      // Step 0 -> Step 1
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));
      expect(
        screen.getByTestId("algorithm-selection-step")
      ).toBeInTheDocument();
      expect(screen.getByText("Configure Algorithm")).toBeInTheDocument();

      // Step 1 -> Step 2
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));
      expect(screen.getByTestId("result-step")).toBeInTheDocument();
      expect(screen.getByText("Results")).toBeInTheDocument();
    });
  });

  describe("Button States", () => {
    test("should disable back button on first step", () => {
      renderWithProviders(<Matchmaking />);

      const backButton = screen.getByText("Back");
      expect(backButton).toBeDisabled();
    });

    test("should enable back button after first step", () => {
      renderWithProviders(<Matchmaking />);

      // Navigate to step 1
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));

      const backButton = screen.getByText("Back");
      expect(backButton).not.toBeDisabled();
    });

    test("should disable next button when isOk is false", () => {
      renderWithProviders(<Matchmaking />);

      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    test("should enable next button when isOk is true", () => {
      renderWithProviders(<Matchmaking />);

      const enableNextButton = screen.getByText("Enable Next");
      fireEvent.click(enableNextButton);

      const nextButton = screen.getByText("Next");
      expect(nextButton).not.toBeDisabled();
    });

    test("should disable next button on last step", () => {
      renderWithProviders(<Matchmaking />);

      // Navigate to final step
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));

      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    test("should re-disable next button when isOk becomes false", () => {
      renderWithProviders(<Matchmaking />);

      // Enable next button
      fireEvent.click(screen.getByText("Enable Next"));
      const nextButton = screen.getByText("Next");
      expect(nextButton).not.toBeDisabled();

      // Disable next button
      fireEvent.click(screen.getByText("Disable Next"));
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Step Content", () => {
    test("should render player selection step content", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByText("Player Selection Step")).toBeInTheDocument();
      expect(screen.getByText("Enable Next")).toBeInTheDocument();
      expect(screen.getByText("Disable Next")).toBeInTheDocument();
    });

    test("should render algorithm selection step content", () => {
      renderWithProviders(<Matchmaking />);

      // Navigate to step 1
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));

      expect(screen.getByText("Algorithm Selection Step")).toBeInTheDocument();
    });

    test("should render result step content", () => {
      renderWithProviders(<Matchmaking />);

      // Navigate to step 2
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));

      expect(screen.getByText("Result Step")).toBeInTheDocument();
    });

    test("should only render one step component at a time", () => {
      renderWithProviders(<Matchmaking />);

      // Initially on step 0
      expect(screen.getByTestId("player-selection-step")).toBeInTheDocument();
      expect(
        screen.queryByTestId("algorithm-selection-step")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("result-step")).not.toBeInTheDocument();

      // Move to step 1
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));

      expect(
        screen.queryByTestId("player-selection-step")
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId("algorithm-selection-step")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("result-step")).not.toBeInTheDocument();

      // Move to step 2
      fireEvent.click(screen.getByText("Enable Next"));
      fireEvent.click(screen.getByText("Next"));

      expect(
        screen.queryByTestId("player-selection-step")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("algorithm-selection-step")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("result-step")).toBeInTheDocument();
    });
  });

  describe("Step Validation", () => {
    test("should pass setIsOk function to step components", () => {
      renderWithProviders(<Matchmaking />);

      // Step components should be able to control the next button
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();

      fireEvent.click(screen.getByText("Enable Next"));
      expect(nextButton).not.toBeDisabled();
    });

    test("should maintain isOk state when navigating between steps", () => {
      renderWithProviders(<Matchmaking />);

      // Enable on step 0
      fireEvent.click(screen.getByText("Enable Next"));

      // Navigate to step 1
      fireEvent.click(screen.getByText("Next"));

      // Next button should be disabled again (new step, new validation)
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Layout and Structure", () => {
    test("should render matchmaking container", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("matchmaking-container")).toBeInTheDocument();
    });

    test("should render step indicator container", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("step-indicator")).toBeInTheDocument();
    });

    test("should render step container", () => {
      renderWithProviders(<Matchmaking />);

      expect(
        screen.getByTestId("matchmaking-step-container")
      ).toBeInTheDocument();
    });

    test("should render navigation buttons container", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("matchmaking-nav-buttons")).toBeInTheDocument();
    });

    test("should render step title", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("step-title")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    test("should be wrapped by MatchMakingProvider", () => {
      renderWithProviders(<Matchmaking />);

      expect(screen.getByTestId("matchmaking-provider")).toBeInTheDocument();
    });

    test("should use MiscContext for getCardbackground", () => {
      renderWithProviders(<Matchmaking />);

      expect(mockMiscContext.getCardbackground).toHaveBeenCalledTimes(1);
    });

    test("should render within X5pageContentArea", () => {
      renderWithProviders(<Matchmaking />);

      const pageContentArea = screen.getByTestId("page-content-area");
      expect(pageContentArea).toBeInTheDocument();
      expect(pageContentArea).toHaveAttribute("data-title", "Matchmaking");
    });
  });
});
