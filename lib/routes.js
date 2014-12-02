var handlers = require('./handlers');

var routes = [
//Main
  { method:  'GET',             path: '/',              config: handlers.home       },
  { method:  'GET',             path: '/app',           config: handlers.main       },
  { method:  'GET',       path: '/profile/{username}',  config: handlers.profile},
  { method:  'GET',             path: '/publications',  config: handlers.pub        },
  { method:  'GET',             path: '/search',        config: handlers.search     },
//Session
  { method: ['GET', 'POST'],    path: '/signup',        config: handlers.signup     },
  { method: ['GET', 'POST'],    path: '/login',         config: handlers.login      },
  { method:  'GET',             path: '/logout',        config: handlers.logout     },
  { method:  'GET',             path: "/public/{path*}",
    handler: {
      directory: {
        path: "./public",
        listing: false,
        index: false
      }
    }
  }
];

module.exports = routes;

