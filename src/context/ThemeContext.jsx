import { createContext, useContext, useMemo } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#1976d2" },
          secondary: { main: "#f50057" },
          background: {
            default: "#f7f9fc",
            paper: "#ffffff",
          },
          text: {
            primary: "#111111",
            secondary: "#555555",
          },
          divider: "#e0e0e0",
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: { fontFamily: '"Georgia", "serif"', fontWeight: 700 },
          h5: { fontFamily: '"Georgia", "serif"', fontWeight: 600 },
        },
      }),
    []
  );

  return (
    <ThemeContext.Provider value={{}}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
