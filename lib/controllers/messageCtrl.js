var controller = {};

controller.show = function (request, reply) {
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

controller.get = function (request, reply) {
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

module.exports = controller;
