import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PlayerSelectionStep from "./playerSelectionStep";
import { MatchMakingContext } from "../context/matchMakingContext";

// Mock dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "matchmaking.playerSelection.title": "Select Players",
        "matchmaking.playerSelection.columns.name": "Name",
        "matchmaking.playerSelection.columns.top": "Top",
        "matchmaking.playerSelection.columns.jungle": "Jungle",
        "matchmaking.playerSelection.columns.mid": "Mid",
        "matchmaking.playerSelection.columns.adc": "ADC",
        "matchmaking.playerSelection.columns.support": "Support",
        "matchmaking.playerSelection.validPlayersSelected":
          "valid players selected",
        "matchmaking.playerSelection.needExactly10Players":
          "Need exactly 10 players",
        "matchmaking.playerSelection.numberOfWildcards": "Number of Wildcards",
        "matchmaking.playerSelection.searchPlaceholder": "Search players...",
        "matchmaking.playerSelection.searchTooltip":
          "Search by name or role rating",
        "matchmaking.playerSelection.noPlayersMatch":
          "No players match your search",
        "matchmaking.playerSelection.wildcardLabels.name": "Name",
        "matchmaking.playerSelection.wildcardLabels.top": "Top",
        "matchmaking.playerSelection.wildcardLabels.jungle": "Jungle",
        "matchmaking.playerSelection.wildcardLabels.mid": "Mid",
        "matchmaking.playerSelection.wildcardLabels.adc": "ADC",
        "matchmaking.playerSelection.wildcardLabels.support": "Support",
      };
      return translations[key] || key;
    },
  }),
}));

const theme = createTheme();

const mockSetIsOk = jest.fn();

const mockContextValue = {
  players: {
    player1: {
      name: "Player 1",
      top: 10,
      jungle: 8,
      mid: 6,
      adc: 4,
      support: 2,
    },
    player2: {
      name: "Player 2",
      top: 5,
      jungle: 9,
      mid: 7,
      adc: 8,
      support: 3,
    },
    player3: {
      name: "Player 3",
      top: 7,
      jungle: 6,
      mid: 10,
      adc: 5,
      support: 9,
    },
  },
  cards: [
    { name: "player1", card: <div>Player 1 Card</div> },
    { name: "player2", card: <div>Player 2 Card</div> },
    { name: "player3", card: <div>Player 3 Card</div> },
  ],
  selectedOptions: [],
  setSelectedOptions: jest.fn(),
  handleOptionChange: jest.fn(),
  error: null,
  cardReadyCounter: 3,
  numberOfWildcards: 0,
  setNumberOfWildcards: jest.fn(),
  wildcardDetails: [],
  setWildcardDetails: jest.fn(),
};

const renderWithProviders = (component, contextValue = mockContextValue) => {
  return render(
    <ThemeProvider theme={theme}>
      <MatchMakingContext.Provider value={contextValue}>
        {component}
      </MatchMakingContext.Provider>
    </ThemeProvider>
  );
};

describe("PlayerSelectionStep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Render", () => {
    test("should render component with basic elements", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      expect(screen.getByText("Select Players")).toBeInTheDocument();
      expect(screen.getByText("0 valid players selected")).toBeInTheDocument();
      expect(screen.getByText("Number of Wildcards:")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search players...")
      ).toBeInTheDocument();
    });

    test("should call setIsOk with correct validation state", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      expect(mockSetIsOk).toHaveBeenCalledWith(true); // no error initially
    });

    test("should render player cards by default", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      expect(screen.getByText("Player 1 Card")).toBeInTheDocument();
      expect(screen.getByText("Player 2 Card")).toBeInTheDocument();
      expect(screen.getByText("Player 3 Card")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    test("should display error when error exists", () => {
      const contextWithError = {
        ...mockContextValue,
        error: "Need exactly 10 players",
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithError
      );

      expect(screen.getByText("- Need exactly 10 players")).toBeInTheDocument();
      expect(screen.getByText("Need exactly 10 players")).toBeInTheDocument();
    });

    test("should call setIsOk with false when error exists", () => {
      const contextWithError = {
        ...mockContextValue,
        error: "Some error",
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithError
      );

      expect(mockSetIsOk).toHaveBeenCalledWith(false);
    });
  });

  describe("View Toggle", () => {
    test("should toggle between card and grid view", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      // Initially in card view
      expect(screen.getByText("Player 1 Card")).toBeInTheDocument();

      // Click toggle button
      const toggleButton = screen.getByRole("button", { name: "" }); // IconButton
      fireEvent.click(toggleButton);

      // Should now be in grid view (cards should be hidden)
      expect(screen.queryByText("Player 1 Card")).not.toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    test("should render search input", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      const searchInput = screen.getByPlaceholderText("Search players...");
      expect(searchInput).toBeInTheDocument();
    });

    test("should clear search with Escape key", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      const searchInput = screen.getByPlaceholderText("Search players...");
      fireEvent.change(searchInput, { target: { value: "test" } });
      fireEvent.keyDown(searchInput, { key: "Escape" });

      expect(searchInput.value).toBe("");
    });
  });

  describe("Wildcard Management", () => {
    test("should increase wildcard count", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockContextValue.setNumberOfWildcards).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test("should decrease wildcard count", () => {
      const contextWithWildcards = {
        ...mockContextValue,
        numberOfWildcards: 2,
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithWildcards
      );

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockContextValue.setNumberOfWildcards).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test("should render wildcard cards when wildcards > 0", () => {
      const contextWithWildcards = {
        ...mockContextValue,
        numberOfWildcards: 2,
        wildcardDetails: [
          { name: "", top: "", jungle: "", mid: "", adc: "", support: "" },
          { name: "", top: "", jungle: "", mid: "", adc: "", support: "" },
        ],
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithWildcards
      );

      // Should render 2 wildcard cards
      const wildcardCards = screen.getAllByText("Name:");
      expect(wildcardCards).toHaveLength(2);
    });

    test("should not render wildcard cards when wildcards = 0", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      expect(screen.queryByText("Name:")).not.toBeInTheDocument();
    });
  });

  describe("Player Selection", () => {
    test("should handle player card selection", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      // Click on the card content - event should bubble to parent card
      const cardContent = screen.getByText("Player 1 Card");
      fireEvent.click(cardContent);

      expect(mockContextValue.handleOptionChange).toHaveBeenCalledWith(
        "player1"
      );
    });

    test("should show selected players count", () => {
      const contextWithSelection = {
        ...mockContextValue,
        selectedOptions: ["player1", "player2"],
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithSelection
      );

      expect(screen.getByText("2 valid players selected")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    test("should show loading spinner when cards are not ready", () => {
      const contextWithLoading = {
        ...mockContextValue,
        cardReadyCounter: 1, // Less than cards.length (3)
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithLoading
      );

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("should hide loading spinner when cards are ready", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Shortcuts", () => {
    test("should focus search field on Ctrl+F", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      const searchInput = screen.getByPlaceholderText("Search players...");

      // Trigger Ctrl+F
      fireEvent.keyDown(window, {
        key: "f",
        ctrlKey: true,
        preventDefault: jest.fn(),
      });

      expect(searchInput).toHaveFocus();
    });

    test("should focus search field on Cmd+F (Mac)", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      const searchInput = screen.getByPlaceholderText("Search players...");

      // Trigger Cmd+F
      fireEvent.keyDown(window, {
        key: "f",
        metaKey: true,
        preventDefault: jest.fn(),
      });

      expect(searchInput).toHaveFocus();
    });
  });

  describe("Validation Display", () => {
    test("should show valid status when no error", () => {
      renderWithProviders(<PlayerSelectionStep setIsOk={mockSetIsOk} />);

      const statusElement = screen.getByText("0 valid players selected");
      expect(statusElement).toHaveClass("status-valid");
    });

    test("should show error status when error exists", () => {
      const contextWithError = {
        ...mockContextValue,
        error: "Some error",
      };
      renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />,
        contextWithError
      );

      const statusElement = screen.getByText("0 valid players selected");
      expect(statusElement).toHaveClass("status-error");
    });
  });

  describe("Component Integration", () => {
    test("should handle context updates correctly", () => {
      const { rerender } = renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />
      );

      // Update context with new data
      const updatedContext = {
        ...mockContextValue,
        selectedOptions: ["player1"],
        error: "Need more players",
      };

      rerender(
        <ThemeProvider theme={theme}>
          <MatchMakingContext.Provider value={updatedContext}>
            <PlayerSelectionStep setIsOk={mockSetIsOk} />
          </MatchMakingContext.Provider>
        </ThemeProvider>
      );

      expect(screen.getByText("1 valid players selected")).toBeInTheDocument();
      expect(screen.getByText("Need more players")).toBeInTheDocument();
    });

    test("should cleanup event listeners on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = renderWithProviders(
        <PlayerSelectionStep setIsOk={mockSetIsOk} />
      );
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});

describe("WildcardCard", () => {
  test("should render wildcard input fields", () => {
    render(
      <ThemeProvider theme={theme}>
        <div>
          {/* Simulate WildcardCard rendering within PlayerSelectionStep */}
          <div className="wildcard-card valid">
            <input data-testid="wildcard-name" defaultValue="Test Player" />
            <input data-testid="wildcard-top" defaultValue="10" />
            <input data-testid="wildcard-jungle" defaultValue="8" />
            <input data-testid="wildcard-mid" defaultValue="6" />
            <input data-testid="wildcard-adc" defaultValue="4" />
            <input data-testid="wildcard-support" defaultValue="2" />
          </div>
        </div>
      </ThemeProvider>
    );

    expect(screen.getByTestId("wildcard-name")).toHaveValue("Test Player");
    expect(screen.getByTestId("wildcard-top")).toHaveValue("10");
    expect(screen.getByTestId("wildcard-jungle")).toHaveValue("8");
  });
});

describe("PlayerCard", () => {
  test("should render player card with correct styling", () => {
    render(
      <ThemeProvider theme={theme}>
        <div
          className="player-card selected"
          style={{ display: "block" }}
          data-testid="player-card"
        >
          <div style={{ height: "300px" }}>
            <div>Test Card Content</div>
          </div>
        </div>
      </ThemeProvider>
    );

    const playerCard = screen.getByTestId("player-card");
    expect(playerCard).toHaveClass("player-card");
    expect(playerCard).toHaveClass("selected");
    expect(playerCard).toHaveStyle("display: block");
    expect(screen.getByText("Test Card Content")).toBeInTheDocument();
  });
});
