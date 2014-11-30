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
  var db = request.server.plugins['hapi-nedb'].db.collection('users');
  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  if (request.method === 'get') {
    return reply.view('signup.hbs', {}, {layout: 'layout'});
  }

  if (request.method === 'post') {
    console.log(request.payload);
    //O if mais feio de sempre?
    if ( !request.payload.username ||
        !request.payload.name     ||
        !request.payload.email    ||
        !request.payload.password )
      return reply.view('signup.hbs', {message: 'Assim não vai dar, yo.'}, {layout: 'layout'});
    else {
      //Guardar na DB e quê mas ver se já existe, calaro.
      var user = {
        username: request.payload.username,
        name    : request.payload.name,
        email   : request.payload.email,
        password: request.payload.password
      }
      db.find({ $or: [{ username: user.username }, { email: user.email }] }, function(err, docs) {
        console.log(docs);
        if (docs.length === 0) {
          db.insert(user);
          return reply.view('index.hbs', {message: 'User registado e assim. uma coisa qualquer dessas'}, {layout: 'layout'});
        }
        return reply.view('signup.hbs', {message: 'esse username ou email já existem. tenta outra vez sff.'}, {layout: 'layout'});
      });
    }
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
  reply.view('homepage.hbs', { title: 'My home page', user: user.username }, { layout: 'logged' });
};
