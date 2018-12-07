/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
import _ from 'lodash';
/** @namespace sails */
_.merge(exports, {

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: (req, res) => {
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    if (!req.isSocket) {
      res.json({message: 'logout'});
    }
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: (req, res) => {
    let provider = req.param('provider');
    let action = req.param('action');

    switch (provider) {
      case 'local':
        if (action === 'register') {
          sails.services.protocols.local.register(req, res);
          break;
        }
        sails.services.protocols.local.login(req, res);
        break;
      case 'facebook':
        if (action === 'callback') {
          sails.services.protocols.facebook.callback(req, res);
          break;
        }
        sails.services.protocols.facebook.facebook(req, res);
        break;
      case 'twitter':
        if (action === 'callback') {
          sails.services.protocols.twitter.callback(req, res);
          break;
        }
        sails.services.protocols.twitter.twitter(req, res);
        break;
      case 'google':
        if (action === 'callback') {
          sails.services.protocols.google.callback(req, res);
          break;
        }
        sails.services.protocols.google.google(req, res);
        break;
      case 'test':
        const obgj = {name: 'julian'};
        let tmp = '<script> window.opener.postMessage(' + '"' + `${obgj}` + '"' + ', "*"); window.location.hash = "#user=asdf" </script>';
        console.log(tmp);
        res.send(tmp);
        // res.redirect('OAuthLogin://login?user='+JSON.stringify({name: 'Oreste'}));
        // res.json({user: {name: 'Oreste'}});
        break;
    }
  }
});
