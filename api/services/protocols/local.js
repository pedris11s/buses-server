// api/services/protocols/local.js

import _ from 'lodash';
let passport = require('passport');

/** @namespace sails */
/** @namespace req.flash */
/** @namespace _user.password */
module.exports = {

  // Extend with custom logic here by adding additional fields and methods,
  // and/or overriding methods in the superclass.

  /**
   * @param {Object}   user
   * @param {Function} next
   */

  createUser: (_user, res) => {
    // check the password
    if (_user.password === '') {
      // toDo: guille, 5/5/18 translate
      return res.json({success: false, msg: 'Empty password'});
    }

    sails.services.repository.user.checkUserCredentials(_user.username, _user.email, (err, users) => {
      if (err) {
        return res.json({success: false, msg: err.message});
      }
      if (users.length > 0) {
        // toDo: guille, 3/16/18 internationalize this message
        return res.json({success: false, msg: 'El usuario o el correo se encuentran en uso'});
      }
      return sails.services.repository.user.createUser(_user)
        .fetch()
        .then((user) => {
          sails.log('local.js', 'user created ' + user);
          // sails.services.mailservice.sendRegisterEmail(user.email, user.verifyToken, (err, info) => {
          //   if (!err) {
          //     sails.log.info('local.js email for register info', info);
          //   }
          // });
          res.json({success: true});
        });
    });
  },

  register: (req, res) => {
    console.log(req.allParams());
    let user = {
      username: req.param('username'),
      password: req.param('password'),
      email: req.param('email'),
      name: req.param('name'),
      lastName: req.param('lastname'),
      provider: req.param('provider'),
    };
    sails.services.protocols.local.createUser(user, res);
  },

  /**
   * Register a new user
   *
   * This method creates a new user from a specified email, username and password
   * and assign the newly created user a local Passport.
   *
   * @param {String}   _user
   * @param {Function} next
   */


  /**
   * Validate a login request
   *
   * Looks up a user using the supplied identifier (email or username) and then
   * attempts to find a local Passport associated with the user. If a Passport is
   * found, its password is checked against the password supplied in the form.
   *
   * @param {Object}   req
   * @param {string}   identifier
   * @param {string}   password
   * @param {Function} next
   */
  login: (req, res) => {
    let identifier = req.param('username');
    let isEmail = sails.services.utils.validateEmail(identifier);

    // console.log(req.allParams());

    if (isEmail) {
      sails.models.user.findOne({email: identifier, provider: 'local'})
        .then((user) => {
          req.body['username'] = (user === undefined) ? identifier : user.username;
          // console.log('email', user);
          module.exports.authenticate(req, res);
        });
    } else {
      // console.log("username ", identifier);
      req.body['username'] = identifier;
      module.exports.authenticate(req, res);
    }
  },

  authenticate: (req, res) => {
    passport.authenticate('local',
      (err, user, info) => {
        if ((err) || (!user)) {
          res.status(203);
          return res.json({
            message: info.message,
            user: false
          });
        }
        return res.json(user);
      })(req, res);
  }
};
