import jwt from 'jsonwebtoken';

/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  let redirect = true;
  if (req.headers.token !== undefined) {
    // if the user do not have a session then check if is using an auth token
    try {
      const {id} = jwt.verify(
        req.headers.token,
        sails.config.globals.genTokenForAutologin);
      redirect = false;
      sails.services.repository.user.getUserById(id)
        .populate('language')
        .then((user) => {
          if (user) {
            req.user = user;
            req.session.authenticated = true;
            next();
          } else {
            res.logout();
          }
        })
        .catch((err) => {
          sails.log.error('sessionAuth.js', err);
          res.logout();
        });
    } catch (err) {
      redirect = true;
    }
  }
  if (redirect) {
    return res.logout();
  }
};
