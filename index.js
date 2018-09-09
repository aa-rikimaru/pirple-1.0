// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');

// Instantiate the HTTP Server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});
// Start the server
httpServer.listen(config.httpPort, function() {
  console.log('The server is listening on port ' + config.httpPort + ' in ' + config.envName + '...');
});
// Instantiate the HTTPS Server
const httpsServerOptions = {
  // 'key': fs.readFileSync('./https/key.pem'),
  // 'cert': fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});
// Start the server
httpServer.listen(config.httpsPort, function() {
  console.log('The server is listening on port ' + config.httpsPort + ' in ' + config.envName + '...');
});

// Unified Server logic
let unifiedServer = (req, res) => {
  // Get the url and parse interval
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the queryString as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  let method = req.method.toUpperCase();

  // Get the headers as an object
  let headers = req.headers;

  // Get teh payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler this request should go to
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to handler
    let data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }

    chosenHandler(data, function(statusCode, payload) {
      // Use the statusCode called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use the payload called back by the handler, or default
      payload = typeof(payload) == 'object' ? payload : {};
      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);
      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      // Log the request path
      console.log('Returning the response', statusCode, '\n', payload);
    });
  });
}

let handlers = {};

handlers.sample = function(data, callback) {
  // Callback a HTTP status code and a payload object
  callback(406, {'name': 'sample handler'});
};

handlers.notFound = function(data, callback) {
  callback(404);
};

let router = {
  'sample': handlers.sample
};
