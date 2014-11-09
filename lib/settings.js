module.exports = {
  port: 8000,
  views: {
    engines: {
      hbs: require('handlebars')
    },
    path: require('path').join(__dirname, '../templates')
  }
};

