var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
var express = require('express');
var request = require('request');

var app = new (express)();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname + '/'));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/bootstrap/kpi/', (req, res) => {
  const url = 'https://flevoland.lizard.net/bootstrap/kpi/';
  const headers = {
    'username': process.env.sso_user,
    'password': process.env.sso_pass,
  };
  req.pipe(request({
    url,
    headers,
  })).pipe(res);
});


app.use('/api', (req, res) => {
  const url = 'https://flevoland.lizard.net/api' + req.url;
  const headers = {
    'username': process.env.sso_user,
    'password': process.env.sso_pass,
  };
  req.pipe(request({
    url,
    headers,
  })).pipe(res);
});


app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
