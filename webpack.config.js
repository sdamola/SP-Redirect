const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

require("dotenv").config();

const solutionVersion = require("./config/package-solution.json").solution.version;

module.exports = {
  mode: "production",
  entry: "./src/assets/redirect.ts",
  output: {
    filename: `redirect.js`,
    path: path.resolve(__dirname, `publish/${solutionVersion}`),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      __sourceSite__: JSON.stringify(process.env.SOURCE_SITE || "null"),
      __sourceList__: JSON.stringify(process.env.SOURCE_LIST || "null"),
      __appInsightsKey__: JSON.stringify(process.env.APP_INSIGHTS_KEY || "null")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
};
