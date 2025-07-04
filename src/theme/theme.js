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
      lineHeight: "1.7",
      padding: 0,
      margin: 0,
    },
  }),
};

const components = {
  Container: {
    baseStyle: {
      maxW: "container.lg",
      px: { base: 4, md: 8 },
      py: { base: 6, md: 10 },
    },
  },
  Box: {
    baseStyle: {
      p: { base: 4, md: 6 },
      mb: 6,
      borderRadius: "lg",
    },
  },
  Heading: {
    baseStyle: {
      mb: 4,
      fontWeight: "bold",
      color: colors.brand.light.text,
    },
  },
  Text: {
    baseStyle: {
      mb: 2,
      fontSize: "md",
    },
  },
  Input: {
    baseStyle: {
      mb: 3,
      borderRadius: "md",
    },
  },
  Button: {
    baseStyle: {
      borderRadius: "xl",
      fontWeight: "semibold",
      px: 6,
      py: 2,
      _hover: {
        opacity: 0.9,
        textDecoration: "none",
      },
    },
    defaultProps: {
      colorScheme: "pink",
    },
  },
};

const chakraTheme = extendTheme({
  config,
  colors,
  styles,
  components,
});

export { chakraTheme };
