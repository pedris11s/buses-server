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
  if (req.session.authenticated) {
    sails.services.repository.role.userRoles(req.user)
      .then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            return next();
          }
        }
        res.status(200);
        res.json({success: false, msg: 'You do not have admin permission'});
      })
      .catch((err) => {
        sails.log.error('adminPolicy.js', err);
        res.serverError();
      });
  } else {
    res.status(200);
    res.json({success: false, msg: 'You do not have admin permission'});
  }
};
