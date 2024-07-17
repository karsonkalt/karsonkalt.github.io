const path = require("path");

module.exports = {
  entry: {
    index: "./assets/ts/index.ts",
    home: "./assets/ts/home/index.ts",
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
