var handlers = {
  login: {
    handler: login,
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
    handler: logout,
    auth: 'session'
  },
  signup: {
    handler: register,
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
  }
};
var users = {
  john: {
    id: 'john',
    password: 'password',
    name: 'John Doe'
  }
};

module.exports = handlers;

function register(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  if (request.method === 'get') {
    return reply.view('signup.hbs', {}, {layout: 'layout'});
  }

  if (request.method === 'post') {

  }

}

function home(request, reply) {

  if (request.auth.isAuthenticated) {
    return reply.redirect('/app');
  }

  reply.view('index.hbs', { title: 'My home page' }, { layout: 'layout' });
};

function login(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db.collection('users');

  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  var message = '';
  var account = null;

  if (request.method === 'post') {
    if (!request.payload.username || !request.payload.password) {
      message = 'Missing username or password';
      return reply.view('login.hbs', {message: message}, {layout: 'layout'});
    }
    else {
      db.find({ username: request.payload.username }, function(err, docs) {
        var account = docs[0];
        console.log(account);
        if (!account || account.password !== request.payload.password) {
          message = 'Invalid username or password';
          return reply.view('login.hbs', {message: message}, {layout: 'layout'});
        }
        request.auth.session.set(account);
        return reply.redirect('/');
      });
    }
  }

  if (request.method === 'get') {
    return reply.view('login.hbs', {}, {layout: 'layout'});
  }

};

function logout(request, reply) {
  request.auth.session.clear();
  return reply.redirect('/');
};

function main(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db.collection('users');
  var user = request.auth.credentials;
  console.log(user);
  reply.view('homepage.hbs', { title: 'My home page', user: user.username }, { layout: 'layout' });
};
