var handlers = require('./handlers');

var routes = [
//Main
  { method:  'GET',             path: '/',        config: handlers.home       },
  { method:  'GET',             path: '/app',     config: handlers.main       },
//Session
  { method: ['GET', 'POST'],    path: '/signup',  config: handlers.signup     },
  { method: ['GET', 'POST'],    path: '/login',   config: handlers.login      },
  { method:  'GET',             path: '/logout',  config: handlers.logout     }
];

module.exports = routes;

