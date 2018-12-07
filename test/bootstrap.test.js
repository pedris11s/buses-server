import Sails from 'sails';
import _ from 'lodash';
import testingConfig from '../config/env/testing';
import path from 'path';
import fs from 'fs';

before(function (done) {
  // Erase the temporal testing database
  let appDB = path.resolve(__dirname, '..', 'test', 'testDb.db');
  if (fs.existsSync(appDB)) {
    fs.unlinkSync(appDB);
  }

  this.timeout(0);

  let appPath = path.resolve(__dirname, '..');

  let config = _.extend(testingConfig, {
    appPath: appPath,
    port: 7777
  });

  // noinspection JSUnresolvedFunction
  Sails.lift(config, (err, server) => {
    if (err) {
      return done(err);
    }
    sails = global.sails = server;

    sails.log.info('bootstrap.test.js', 'SEEEEEEEEEEEEE');
    done(null, server);
  });
});

// noinspection ES6ModulesDependencies
after((done) => {
  // here you can clear fixtures, etc.
  global.sails.lower(done);

  // Erase the temporal testing database
  let appDB = path.resolve(__dirname, '..', 'test', 'testDb.db');
  if (fs.existsSync(appDB)) {
    fs.unlinkSync(appDB);
  }
});
