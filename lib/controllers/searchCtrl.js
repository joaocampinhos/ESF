var controller = {};

controller.main = function (request, reply) {
  var db = request.server.plugins['hapi-nedb'].db;
  var user = request.auth.credentials;
  //Nada a pesquisar, yo.
  if (!request.query.q) return reply.view('search.hbs', {actives: true, user: user}, { layout: 'logged' });
  //Pesquisar por nome e por username
  var query = new RegExp(request.query.q,'i');
  db.collection('users').find({ $or: [{username: query},{name: query}]}, function(err, docs) {
    db.collection('publications').find({ $or: [{title: query},
      { $or: [{"author.username": query},{"author.name": query}]}]},  function(err, docsp) {
      reply.view('search.hbs', { actives: true, user: user, users: docs, pubs: docsp, query: request.query.q}, { layout: 'logged' });
    });
  });
};

module.exports = controller;
