const commonjs = require("@rollup/plugin-commonjs");

module.exports = {
  input: "app.js",
  output: {
    file: "dist/app.min.js",
    format: "cjs",
    sourcemap: true,
    exports: "default",
  },
  plugins: [commonjs()],
};
