module.exports = {
  content: ["./pages/**/*.{js,ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#05010f", 2: "#0b0418", 3: "#120725" },
        dusk: "#1a0433",
        haze: { DEFAULT: "#b9a9d6", dim: "#8a7aa8" },
        wire: "#2a1a47",
        neon: {
          pink: "#ff2a6d",
          cyan: "#05d9e8",
          acid: "#f9f002",
          tent: "#ff7a1a",
        },
        bone: "#f3eefc",
      },
      fontFamily: {
        sans: ["Archivo", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      maxWidth: { page: "86rem" },
    },
  },
  plugins: [],
};
