var passport = require('passport');

module.exports = {
  twitter: function (req, res) {
    passport.authenticate('twitter', { scope: ['email']},
      function (err, user) {
      console.log('usuario Twitter', user);
      if (err) console.log('Err', err);
        if(user) {
          return res.json(user);
        }
        res.json();
      })(req, res);
  },
  callback: function (req, res, next) {
    passport.authenticate('twitter',
      function (err, user) {
        if(err) {
          return res.serverError(err);
        }
        return sails.services.utils.manageSocialResponse(user, req, res);
      })(req, res, next);
  },
};
