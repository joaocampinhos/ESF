var good = {
  plugin: require('good'),
  options: {
    reporters: [{
      reporter: require('good-console'),
      args:[{ log: '*', request: '*' }]
    }]
  }
};

var nedb = {
  plugin: require('hapi-nedb'),
  options: {
    directory: "db/"
  }
};

var auth = {
  plugin: require('hapi-auth-cookie')
}

var plugins = [good, nedb, auth];

module.exports = plugins;
