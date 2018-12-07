/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for modules in the production        *
   * environment (see config/connections.js and config/modules.js )           *
   ***************************************************************************/

  models: {
    datastore: 'mongodbServer'
  },

  /***************************************************************************
   * Set the port in the production environment to 80                         *
   ***************************************************************************/

  port: 1337,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   * silly, verbose, info, debug, warn, error                                *
   ***************************************************************************/

  // log: {
  //   level: 'silent'
  // }

  hookTimeout: 30000

};
