var passport = require('passport')

module.exports = {
  google: function (req, res) {
    passport.authenticate('google', { scope: ['email']},
      function (err, user) {
	console.log('error en la peticion', err);
	console.log('user en la peticion', user);
      })(req, res);
  },
  callback: function (req, res) {
    passport.authenticate('google',
      function (dataUser, user) {
        if(user) sails.services.utils.manageSocialResponse(user, req, res);
      })(req, res);
  },
};
