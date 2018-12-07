var passport = require('passport')

module.exports = {
  facebook: function (req, res) {
    return sails.models.user.find().populate('roles')
      .then((usrs) => {
        return sails.services.utils.manageSocialResponse(usrs[0], req, res);
      });
    passport.authenticate('facebook', { scope: ['email']},
      function (err, user) {

      })(req, res);
  },
  callback: function (req, res) {
    passport.authenticate('facebook',
      function (dataUser, user) {
        if(user) sails.services.utils.manageSocialResponse(user, req, res);
      })(req, res);
  },
};
