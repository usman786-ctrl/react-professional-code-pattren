var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
    proxy.web(req, res, {
        target: 'http://104.168.171.247:9080',
        secure: false,
        ws: false,
        prependPath: false,
        ignorePath: false,
    });
});

console.log("server listening on port 8000")
server.listen(8000);

proxy.on('error', function (err, req, res) {
  console.log(err)
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end("Internal server error.");
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH');
});