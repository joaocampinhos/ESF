module.exports = {
  port: 8000,
  views: {
    engines: {
      hbs: require('handlebars')
    },
    basePath: __dirname,
    path: './templates',
    layoutPath: './templates/layout',
    helpersPath: './templates/helpers'
  }
};

