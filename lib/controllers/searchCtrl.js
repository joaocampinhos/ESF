var controller = {};

controller.main = function (request, reply) {
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

module.exports = controller;
