var routes = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: function (request, reply) {
        var app = require('../package.json');
        reply({
          Name: app.name,
          Version: app.version
        });
      }
    }
  },
  {
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
      reply.view('index.hbs');
    }
  }
];

module.exports = routes;

