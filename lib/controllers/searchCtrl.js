var controller = {};

controller.main = function (request, reply) {
  var db = request.server.plugins['hapi-nedb'].db;
  var user = request.auth.credentials;

  //Nada a pesquisar, yo.
  if (!request.query.q) return reply.view('search.hbs', {actives: true, user: user}, { layout: 'logged' });

  var query = new RegExp(request.query.q,'i');
  if (request.query.filter === 'Filter') {
    db.collection('users').find({ $or: [{username: query},{name: query}]}, function(err, docs) {
      db.collection('publications').find({ $or: [{title: query}, { $or: [{"author.username": query},{"author.name": query}]}]},  function(err, docsp) {
        reply.view('search.hbs', { actives: true, user: user, users: docs, pubs: docsp, query: request.query.q}, { layout: 'logged' });
      });
    });
  }

  else if (request.query.filter === 'Users') {
    db.collection('users').find({ $or: [{username: query},{name: query}]}, function(err, docs) {
      reply.view('search.hbs', { actives: true, user: user, users: docs, query: request.query.q}, { layout: 'logged' });
    });
  }

  else if (request.query.filter === 'Publications') {
    db.collection('publications').find({ $or: [{title: query}, { $or: [{"author.username": query},{"author.name": query}]}]},  function(err, docsp) {
      reply.view('search.hbs', { actives: true, user: user, pubs: docsp, query: request.query.q}, { layout: 'logged' });
    });
  }

  else {
    reply.view('search.hbs', { messages: "There was an error with your search. Please try again", actives: true }, { layout: 'logged' });
  }

};

module.exports = controller;
