var ctl = require('./controllers');

var handlers = {
  login: {
    handler: ctl.profile.login,
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    }
  },
  logout: {
    handler: ctl.profile.logout,
    auth: 'session'
  },
  signup: {
    handler: ctl.profile.new,
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    }
  },
  home: {
    handler: home,
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    }
  },
  main: {
    handler: main,
    auth: 'session'
  },
  profile: {
    handler: ctl.profile.get,
    auth: 'session'
  },
  pub: {
    handler: ctl.pub.show,
    auth: 'session'
  },
  createpub: {
    handler: ctl.pub.new,
    auth: 'session'
  },
  Pcreatepub: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: ctl.pub.create,
    auth: 'session'
  },
  getpub: {
    handler: ctl.pub.get,
    auth: 'session'
  },
  search: {
    handler: ctl.search.main,
    auth: 'session'
  },
  messages: {
    handler: ctl.message.show,
    auth: 'session'
  },
  getmessage: {
    handler: ctl.message.get,
    auth: 'session'
  }
};
module.exports = handlers;

function home(request, reply) {

  if (request.auth.isAuthenticated) {
    return reply.redirect('/app');
  }

  reply.view('index.hbs', { title: 'My home page' }, { layout: 'layout' });
};

function main(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db.collection('users');
  var user = request.auth.credentials;
  console.log(user);
  reply.view('homepage.hbs', { title: 'My home page', user: user}, { layout: 'logged' });
};
