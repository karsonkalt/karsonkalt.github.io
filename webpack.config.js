const path = require("path");

module.exports = {
  entry: {
    index: "./assets/ts/index.ts",
    tabs: "./assets/ts/tabs.ts", // Add other entry points here
    entry: "./assets/ts/terminal/index.ts", // Update this path as needed
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "assets/js"),
  },
};
