var controller = {};

controller.new = function(request, reply) {
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
      return reply.view('signup.hbs', {message: 'Those fields cannot be empty.'}, {layout: 'layout'});
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
          return reply.view('index.hbs', {message: 'User registed with success'}, {layout: 'layout'});
        }
        return reply.view('signup.hbs', {message: 'Invalid username or email adress'}, {layout: 'layout'});
      });
    }
  }
}

controller.login = function(request, reply) {
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

controller.logout = function(request, reply) {
  request.auth.session.clear();
  return reply.redirect('/');
};

controller.get = function profile(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db.collection('users');
  var user = request.auth.credentials;
  var diff = true;
  db.find({ username: request.params.username }, function(err, docs) {
    var profile = docs[0];
    if (!profile) {
      reply.view('profile.hbs', { message: 'User not found', user: user }, {layout: 'logged'});
    }
    else {
      if (profile.username === user.username) diff = false;
      reply.view('profile.hbs', { title: 'My home page', profile: profile, user: user ,diff: diff}, { layout: 'logged' });
    }
  });
};

module.exports = controller;
