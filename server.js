var Hapi = require('hapi');
var Path = require('path');

var settings = require('./lib/settings');
var plugins = require('./lib/plugins');
var routes = require('./lib/routes');

var server = new Hapi.Server('localhost', settings.port);

server.pack.register(plugins, function (err) { if(err){console.log(err);return;} });
server.views(settings.views);
server.route(routes);

server.start();
