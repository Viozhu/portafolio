module.exports = {
  content: ["./pages/**/*.{js,ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        enamel: "#f4f4f1",
        paper: "#ffffff",
        ink: "#12161f",
        steel: "#4a5163",
        rule: "#d6d6cf",
        sign: { DEFAULT: "#1b2333", deep: "#121826", line: "#2c3548", text: "#c7cdd9" },
        line2: "#00a84d",
        line3: { DEFAULT: "#ef7c1c", ink: "#a94f00" },
        line5: "#996cac",
        line1: "#0052a4",
      },
      fontFamily: {
        sans: [
          "Archivo",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "Noto Sans KR",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: { page: "84rem" },
    },
  },
  plugins: [],
};
