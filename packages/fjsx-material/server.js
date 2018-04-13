//https://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var compiler = webpack(webpackConfig);

var server = new WebpackDevServer(compiler, {
  open: true,
  inline: true,
  historyApiFallback: {
    index: "./packages/fjsx-material-ui/index.html"
  },
  stats: {
    colors: true
  }
});
server.listen(3040);
