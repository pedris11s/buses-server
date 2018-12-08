/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

  // 'get /api/logout': {controller: 'AuthController', action: 'logout'},
  '/api/auth/:provider': {controller: 'AuthController', action: 'callback'},
  '/auth/:provider/:action': {controller: 'AuthController', action: 'callback'},
  '/api/auth/:provider/:action': {controller: 'AuthController', action: 'callback'},

  // for verify the account in the register process
  'get /api/verify_account/:verify_token': {controller: 'UserController', action: 'verifyAccount'},

  //cooperativa controller
  'put /api/cooperativa/vote': {controller: 'CooperativaController', action: 'vote'},

  // user controller
  'get /api/user/list': {controller: 'UserController', action: 'list'},
  'get /api/user/current_user': {controller: 'UserController', action: 'currentUser'},
  'put /api/user/profile': {controller: 'UserController', action: 'updateProfile'},
  'put /api/user/password': {controller: 'UserController', action: 'updateProfilePassword'},
  '/api/user/showUser': {controller: 'UserController', action: 'showUser'}

  // for web site endpoints (SPA)
  // 'get /*': {controller: 'index', action: 'index', skipAssets: true, skipRegex: /^\/api\/.*$/}
};
