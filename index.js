const url = require("url");
const http = require("http");
const acceptor = http.createServer().listen(process.env.PORT || 21116);

acceptor.on("request", function (request, response) {
  console.log("request " + request.url);
  request.pause();
  var options = url.parse(request.url.replace("/", "").replace("3101//", "3101/"));
  options.headers = request.headers;
  options.method = request.method;
  options.agent = false;

  var connector = http.request(options, function (serverResponse) {
    serverResponse.pause();
    response.writeHeader(serverResponse.statusCode, serverResponse.headers);
    serverResponse.pipe(response);
    serverResponse.resume();
  });

  connector.on("error", function (err) {
    connector.end();
    request.emit("error", err)
  });

  request.pipe(connector);
  request.resume();
  
  
  request.on("error", function (err) {
   
  })
});
