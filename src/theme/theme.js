// src/theme/theme.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    light: {
      bg: "#FAEDEC",
      text: "#353325",
      accent: "#92636B",
      secondary: "#A18E88",
      surface: "#fffaf9",
    },
    dark: {
      bg: "#353325",
      text: "#FAEDEC",
      accent: "#92636B",
      secondary: "#A18E88",
      surface: "#4a473f",
    },
  },
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === "light" ? colors.brand.light.bg : colors.brand.dark.bg,
      color: props.colorMode === "light" ? colors.brand.light.text : colors.brand.dark.text,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
  }),
};

const chakraTheme = extendTheme({ config, colors, styles });

export { chakraTheme };
