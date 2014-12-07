var fs = require('fs');

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
  },
  profile: {
    handler: profile,
    auth: 'session'
  },
  pub: {
    handler: pub,
    auth: 'session'
  },
  createpub: {
    handler: createpub,
    auth: 'session'
  },
  Pcreatepub: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: Pcreatepub,
    auth: 'session'
  },
  getpub: {
    handler: getpub,
    auth: 'session'
  },
  search: {
    handler: search,
    auth: 'session'
  },
  messages: {
    handler: messages,
    auth: 'session'
  },
  getmessage: {
    handler: getmessage,
    auth: 'session'
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
  reply.view('homepage.hbs', { title: 'My home page', user: user}, { layout: 'logged' });
};

function profile(request, reply) {
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

function messages(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db.collection('messages');
  var user = request.auth.credentials;
  if (request.method === 'post') {
    var from = user.username;
    var to = request.payload.to;
    var message = request.payload.message;
    db.update({ $or: [{ $and: [{u1: from},{u2: to}]},{ $and: [{u1: to},{u2: from}]}]}, { $push: { messages: {from: from, message: message} } }, {},function(err,doc) {
      console.log(doc);
      reply.redirect('/messages/'+to);
    });
  }
  if (request.method === 'get') {
    db.find({ $or: [{ u1: user.username }, { u2: user.username }] }, function(err,docs) {
      var messages = docs.map(function(el) {
        var res = {}
        if (el.u1 === user.username)
        res.user = el.u2;
        else
        res.user = el.u1;
      return res;
      });
      console.log(messages);
      reply.view('messages.hbs', { messages: messages, auth: user, user: user}, { layout: 'logged' });
    });
  }
};

function getmessage(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db.collection('messages');
  var u2 = request.params.profile;
  var user = request.auth.credentials;
  db.find({ $or: [{ u1: user.username }, { u2: user.username }] }, function(err,docs) {

    if (docs.length === 0 ) {
      db.insert({u1: user.username, u2: u2, messages: []});
      return reply.redirect('/messages/'+u2);
    }

    var el = docs[0];
    var obj = {}
    if (el.u1 === user.username && el.u2 === u2) {
      obj.user = el.u2;
      obj.messages = el.messages;
    }
    if (el.u1 === u2 && el.u2 === user.username) {
      obj.user = el.u1;
      obj.messages = el.messages;
    }

    if (Object.getOwnPropertyNames(obj).length === 0 ) {
      db.insert({u1: user.username, u2: u2, messages: []});
      return reply.redirect('/messages/'+u2);
    }

    reply.view('messageView.hbs', { messages: obj, user: user}, { layout: 'logged' });
  });
};

function search(request, reply) {
  var db = request.server.plugins['hapi-nedb'].db;
  var user = request.auth.credentials;
  //TODO: pesquisa de publicações
  //Nada a pesquisar, yo.
  if (!request.query.q) return reply.view('search.hbs', {user: user}, { layout: 'logged' });
  //Pesquisar por nome e por username
  var query = new RegExp(request.query.q,'i');
  db.collection('users').find({ $or: [{username: query},{name: query}]}, function(err, docs) {
    reply.view('search.hbs', {user: user, users: docs}, { layout: 'logged' });
  });

};

function pub(request, reply){
  var db = request.server.plugins['hapi-nedb'].db.collection('publications');
  var user = request.auth.credentials;
  db.find({}, function(err,docs) {
    reply.view('publications.hbs',{ publications: docs,  user: user}, { layout: 'logged' });
  });
};

function createpub(request, reply){
  var user = request.auth.credentials;
  return reply.view('createPublication.hbs', {user: user}, {layout: 'logged'});
};

function Pcreatepub(request, reply){
  var db = request.server.plugins['hapi-nedb'].db.collection('publications');
  var user = request.auth.credentials;

  if (!request.payload.title || !request.payload.file)
    return reply.view('createPublication.hbs', {message: "Please provide some information about the document", user: user}, {layout: 'logged'});
  else {
    var name = request.payload.file.hapi.filename;
    var path = __dirname + "/../public/uploads/" + name;
    var file = fs.createWriteStream(path);

    file.on('error', function (err) { 
      console.error(err) 
    });

    request.payload.file.pipe(file);

    var pub = {
      title: request.payload.title,
      authorId: request.auth.credentials._id,
      file: path,
      //Experimentação
      author: request.auth.credentials
    }

    console.log(pub);
    db.find({}, function(err, docs) {
      db.insert(pub);
      reply.redirect('/publications');
    });
  }
};

function getpub(request, reply){
  var db = request.server.plugins['hapi-nedb'].db.collection('publications');
  var user = request.auth.credentials;
  var publicationId = request.params.id;
  db.findOne({ _id: publicationId },{}, function(err,docs) {
    docs.file = docs.file.replace(/.+?(?=public)/, '');
    reply.view('publicationDetails.hbs',{ publication: docs,  user: user.username}, { layout: 'logged' });
  });
};
