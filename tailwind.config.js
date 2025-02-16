/** @type {import('tailwindcss').Config} */
module.exports = {
  ontent: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
