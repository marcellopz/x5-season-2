import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import X5pageContentArea from "./X5pageContentArea";

// Mock framer-motion to avoid issues with animations in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, ...props }) => (
      <div
        className={className}
        style={style}
        data-testid="x5-page-content-area"
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

// Create a theme for Material-UI components
const theme = createTheme();

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("X5pageContentArea", () => {
  describe("Loading State", () => {
    test("should render loading spinner when loading is true", () => {
      renderWithTheme(
        <X5pageContentArea loading={true}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    });

    test("should render children when loading is false", () => {
      renderWithTheme(
        <X5pageContentArea loading={false}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    test("should render children when loading is not provided", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>Test content</div>
        </X5pageContentArea>
      );

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });
  });

  describe("Title Display", () => {
    test("should render title when title prop is provided", () => {
      renderWithTheme(
        <X5pageContentArea title="Test Title">
          <div>Test content</div>
        </X5pageContentArea>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    test("should not render title when title prop is not provided", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>Test content</div>
        </X5pageContentArea>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
      // Check that no h1, h2, etc. elements are rendered for title
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    test("should not render title when title prop is empty string", () => {
      renderWithTheme(
        <X5pageContentArea title="">
          <div>Test content</div>
        </X5pageContentArea>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Background Styling", () => {
    test("should apply with-background class by default", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveClass("x5-page-content-area");
      expect(contentArea).toHaveClass("with-background");
    });

    test("should not apply with-background class when noBackground is true", () => {
      renderWithTheme(
        <X5pageContentArea noBackground={true}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveClass("x5-page-content-area");
      expect(contentArea).not.toHaveClass("with-background");
    });
  });

  describe("Margin and Styling", () => {
    test("should apply default padding-top when removeMarginTop is not provided", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveStyle("padding-top: 20px");
    });

    test("should remove padding-top when removeMarginTop is true", () => {
      renderWithTheme(
        <X5pageContentArea removeMarginTop={true}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveStyle("padding-top: 0");
    });

    test("should apply custom styles from sx prop", () => {
      const customSx = {
        backgroundColor: "red",
        color: "white",
        fontSize: "16px",
      };

      renderWithTheme(
        <X5pageContentArea sx={customSx}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveStyle("background-color: red");
      expect(contentArea).toHaveStyle("color: white");
      expect(contentArea).toHaveStyle("font-size: 16px");
    });

    test("should merge sx prop with default padding-top", () => {
      const customSx = {
        backgroundColor: "blue",
        marginLeft: "10px",
      };

      renderWithTheme(
        <X5pageContentArea sx={customSx}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveStyle("background-color: blue");
      expect(contentArea).toHaveStyle("margin-left: 10px");
      expect(contentArea).toHaveStyle("padding-top: 20px");
    });

    test("should override padding-top with sx prop when removeMarginTop is true", () => {
      const customSx = {
        paddingTop: "50px",
      };

      renderWithTheme(
        <X5pageContentArea removeMarginTop={true} sx={customSx}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      // sx should override the removeMarginTop setting
      expect(contentArea).toHaveStyle("padding-top: 50px");
    });
  });

  describe("Children Rendering", () => {
    test("should render single child element", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>Single child</div>
        </X5pageContentArea>
      );

      expect(screen.getByText("Single child")).toBeInTheDocument();
    });

    test("should render multiple child elements", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>First child</div>
          <span>Second child</span>
          <p>Third child</p>
        </X5pageContentArea>
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
      expect(screen.getByText("Third child")).toBeInTheDocument();
    });

    test("should render complex nested children", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>
            <h2>Nested Title</h2>
            <div>
              <span>Deeply nested</span>
            </div>
          </div>
        </X5pageContentArea>
      );

      expect(screen.getByText("Nested Title")).toBeInTheDocument();
      expect(screen.getByText("Deeply nested")).toBeInTheDocument();
    });
  });

  describe("Combined Props", () => {
    test("should handle all props together correctly", () => {
      const customSx = {
        backgroundColor: "yellow",
        border: "1px solid black",
      };

      renderWithTheme(
        <X5pageContentArea
          title="Combined Test"
          removeMarginTop={true}
          noBackground={true}
          sx={customSx}
        >
          <div>Combined content</div>
        </X5pageContentArea>
      );

      // Check title
      expect(screen.getByText("Combined Test")).toBeInTheDocument();

      // Check content
      expect(screen.getByText("Combined content")).toBeInTheDocument();

      // Check styling and classes
      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toHaveClass("x5-page-content-area");
      expect(contentArea).not.toHaveClass("with-background");
      expect(contentArea).toHaveStyle("padding-top: 0");
      expect(contentArea).toHaveStyle("background-color: yellow");
      expect(contentArea).toHaveStyle("border: 1px solid black");
    });

    test("should handle loading state with other props", () => {
      renderWithTheme(
        <X5pageContentArea
          loading={true}
          title="Should not show"
          removeMarginTop={true}
          sx={{ backgroundColor: "red" }}
        >
          <div>Should not show</div>
        </X5pageContentArea>
      );

      // Only loading spinner should be visible
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
    });
  });

  describe("Container Structure", () => {
    test("should have correct container structure", () => {
      renderWithTheme(
        <X5pageContentArea>
          <div>Test content</div>
        </X5pageContentArea>
      );

      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toBeInTheDocument();
      expect(contentArea).toHaveClass("x5-page-content-area");
    });

    test("should have loading container structure when loading", () => {
      renderWithTheme(
        <X5pageContentArea loading={true}>
          <div>Test content</div>
        </X5pageContentArea>
      );

      // Verify loading spinner is present
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();

      // Verify content is not shown during loading
      expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("should handle null children", () => {
      renderWithTheme(<X5pageContentArea>{null}</X5pageContentArea>);

      // Should render without errors
      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toBeInTheDocument();
    });

    test("should handle undefined children", () => {
      renderWithTheme(<X5pageContentArea>{undefined}</X5pageContentArea>);

      // Should render without errors
      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toBeInTheDocument();
    });

    test("should handle empty children", () => {
      renderWithTheme(<X5pageContentArea></X5pageContentArea>);

      // Should render without errors
      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toBeInTheDocument();
    });

    test("should handle boolean false as children", () => {
      renderWithTheme(<X5pageContentArea>{false}</X5pageContentArea>);

      // Should render without errors
      const contentArea = screen.getByTestId("x5-page-content-area");
      expect(contentArea).toBeInTheDocument();
    });
  });
});
