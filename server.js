var restify = require('restify'),
    https = require('restify-https'),
    fs = require('fs');

var caught = false,
    onScreen = false;

var https_options = {
    key: fs.readFileSync('./corp.netflix.key'), //on current folder
    certificate: fs.readFileSync('./corp.netflix.com.crt')
};

function respond(req, res, next) {

  var sendResponse = {};

  if(req.getQuery()) {
    onScreen = req.getQuery() === 'p=true';
    if(!onScreen) {
      caught = false;
    }
    console.log('onScreen: ', onScreen);
  }
  if(req._url) { // handle empty request
    if(req._url.pathname === "/throw"){
      caught = onScreen;
      console.log('caught: ', caught);
      sendResponse["caught"] = caught;
    }
    if(req._url.pathname === "/update"){
      sendResponse["caught"] = caught;
    }
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(sendResponse);
  next();
}
var https_server = restify.createServer(https_options);
https_server.listen(8081, function() {
   console.log('%s listening at %s', https_server.name, https_server.url);
   https_server.get('/update/', respond);
   https_server.head('/update/', respond);
   https_server.get('/', respond);
});

var server = restify.createServer();
server.get('/update/', respond);
server.get('/throw/', respond);
server.get('/', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
