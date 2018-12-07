var expressJwt = require('express-jwt');
var secret = sails.config.globals.genTokenForAutologin;

module.exports = expressJwt({secret: secret});
