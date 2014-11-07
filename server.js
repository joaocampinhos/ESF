var Path = require('path');
var Hapi = require('hapi');

//Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);

var options = {
  reporters: [{
    reporter: require('good-console'),
    args:[{ log: '*', request: '*' }]
  }]
};

server.pack.register({
  plugin: require('good'),
  options: options
}, function (err) {

  if (err) {
    console.log(err);
    return;
  }
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'templates')
});

//Add the route
server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request, reply) {
    reply.view('index');
  }
});

//Start the server
server.start();
