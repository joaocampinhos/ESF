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
  options: {}
};

var plugins = [good, nedb];

module.exports = plugins;
