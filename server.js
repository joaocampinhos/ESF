var Hapi = require('hapi');
var Path = require('path');

var settings = require('./settings');
var plugins = require('./lib/plugins');
var routes = require('./lib/routes');

var server = new Hapi.Server('localhost', settings.port);

server.pack.register(plugins, function (err) {

  server.auth.strategy('session', 'cookie', {
    password: 'secret',
    redirectTo: '/login',
    isSecure: false
  });

  server.views(settings.views);
  server.route(routes);

  server.start();

  if(err) {
    console.log(err);
    return;
  }

});

