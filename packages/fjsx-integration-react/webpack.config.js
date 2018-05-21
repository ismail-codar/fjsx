const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },

  entry: "./src/index.tsx",
  mode: "production",
  plugins: [
    new CleanWebpackPlugin("dist"),
    new BundleAnalyzerPlugin({
      // Can be `server`, `static` or `disabled`.
      // In `server` mode analyzer will activate HTTP server to show bundle report.
      // In `static` mode single HTML file with bundle report will be generated.
      // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
      analyzerMode: "static",
      reportFilename: "report.html",
      openAnalyzer: true,
      logLevel: "info"
    })
  ],
  externals: ["@fjsx/runtime", "react", "react-dom"],
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs"
  }
};
