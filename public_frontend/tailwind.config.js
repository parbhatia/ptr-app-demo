module.exports = {
  purge: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
    "./components/**/*.js",
    "./layouts/**/*.js",
    "./pages/**/*.js",
    "./plugins/**/*.js",
  ],
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        orange: {
          dark: "#a35709",
          default: "#c06014",
        },
        code: {
          dark: "#212121",
          light: "#f9fafc",
        },
        company: {
          DEFAULT: "#c13420",
          light: "#FFFAF0",
        },
        gray: {
          darkest: "#424642",
          dark: "#6e6d6d",
          DEFAULT: "#cdc7be",
          light: "#eeeeee",
          lightest: "#f9fafc",
        },
        background: {
          DEFAULT: "#f3f4f6",
          // DEFAULT: "#FFFAF0",
        },
        shade: {
          // DEFAULT: "#7B341E",
          // light: "#D5D4D7",
          black: "#3d3c39",
          darkest: "#5b5a56",
          darker: "#ccc8c0",
          DEFAULT: "#e5e1d8",
          light: "#efede7",
          lightest: "#fffdf9",
        },
        file: {
          background: "#f5efed",
        },
      },
      textColor: (theme) => theme("colors"),
      textColor: {
        primary: "#303030",
        secondary: "#ffed4a",
        danger: "#e3342f",
        white: "#f3f4ed",
        company: "#c13420",
      },
      animation: {
        "fade-in": "fade-in 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
