/**
 * Testing environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
module.exports = {
  log: { level: 'silent' },
  // models: {
  //   migrate: 'drop',
  //   datastore: 'localDiskDb',
  //   attributes: {
  //     createdAt: {type: 'number', autoCreatedAt: true,},
  //     updatedAt: {type: 'number', autoUpdatedAt: true,},
  //     id: {type: 'number', autoIncrement: true, columnName: '_id'}
  //   },
  // },
  models: {
    datastore: 'mongodbServer',
    migrate: 'drop'
    // migrate: 'safe'
  },
  //
  datastores: {
    mongodbServer: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      // optional
      // user: 'username',
      // optional
      // password: 'password',
      // optional
      database: 'wankar-test-db'
    }
  },
  environment: 'test',
  // datastores: {
  //   localDiskDb: {
  //     adapter: 'sails-disk',
  //     filePath: 'test/',
  //     fileName: 'testDb.db'
  //   }
  // },
  globals: {
    synchronizeLanguageFile: false
  },
  hooks: { grunt: false },
  cors: {
    allRoutes: true,
    credentials: false
  },
  port: 1336
};
