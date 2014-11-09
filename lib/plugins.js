var good = {
  plugin: require('good'),
  options: {
    reporters: [{
      reporter: require('good-console'),
      args:[{ log: '*', request: '*' }]
    }]
  }
};

var plugins = [good];

module.exports = plugins;
