import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { AuthProvider } from "./contexts/authContext";
import AppRoutes from "./routes/routes";
import { theme } from "./theme";
import { MiscProvider } from "./contexts/miscContext";
import "./i18n/index";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <MiscProvider>
          <AppRoutes />
        </MiscProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
