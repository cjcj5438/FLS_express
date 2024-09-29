const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "app.js"),
  target: "node",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
