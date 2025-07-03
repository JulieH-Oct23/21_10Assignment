// src/main.jsx
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { chakraTheme } from "./theme/theme"; // Make sure this is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={chakraTheme}>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);