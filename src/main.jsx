import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";

// Define your custom colors for light and dark modes
const colors = {
  brand: {
    light: {
      bg: "#FAEDEC",
      surface: "#FAEDEC",
      text: "#353325",
      accent: "#92636B",
      secondary: "#A18E88",
    },
    dark: {
      bg: "#353325",
      surface: "#4a473f",
      text: "#FAEDEC",
      accent: "#92636B",
      secondary: "#A18E88",
    },
  },
};

const theme = extendTheme({ colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {/* No separate Home route needed */}
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);