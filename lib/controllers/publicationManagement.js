var fs = require('fs');

var controller = {};

controller.show = function(request, reply){
  var db = request.server.plugins['hapi-nedb'].db.collection('publications');
  var user = request.auth.credentials;
  db.find({}, function(err,docs) {
    reply.view('publications.hbs',{ publications: docs,  user: user}, { layout: 'logged' });
  });
};

controller.new = function(request, reply){
  var user = request.auth.credentials;
  return reply.view('createPublication.hbs', {user: user}, {layout: 'logged'});
};

controller.create = function(request, reply){
  var db = request.server.plugins['hapi-nedb'].db.collection('publications');
  var user = request.auth.credentials;

  if (!request.payload.title || !request.payload.file)
    return reply.view('createPublication.hbs', {message: "Please provide some information about the document", user: user}, {layout: 'logged'});
  else {
    var name = request.payload.file.hapi.filename;
    var path = __dirname + "/../../public/uploads/" + name;
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

controller.get = function(request, reply){
  var db = request.server.plugins['hapi-nedb'].db.collection('publications');
  var user = request.auth.credentials;
  var publicationId = request.params.id;
  db.findOne({ _id: publicationId },{}, function(err,docs) {
    docs.file = docs.file.replace(/.+?(?=public)/, '');
    reply.view('publicationDetails.hbs',{ publication: docs,  user: user.user}, { layout: 'logged' });
  });
};

module.exports = controller;
