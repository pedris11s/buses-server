let express = require('express');
// noinspection JSUnusedGlobalSymbols
module.exports.http = {
  customMiddleware: function (app) {
    app.use('/node_modules', express.static(process.cwd() + '/node_modules'));
    app.use(express.static('assets'));
  }
};
