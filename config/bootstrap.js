/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

/** @namespace sails */
/** @namespace sails.services */

module.exports.bootstrap = async function (cb) {

  // start project fixtures
  // sails.services.fixtures.intitFixtures();
  let data = {};
  await sails.models.role.findOrCreate({ name: 'cliente' }, { name: 'cliente' });
  await sails.models.role.findOrCreate({ name: 'admin' }, { name: 'admin' });
  await sails.models.role.findOne({ name: 'root' })
    .then((role) => {
      if (role) return role;
      return sails.models.role.create({ name: 'root' }).fetch()
    })
    .then((role) => {
      data.role = role;
      return sails.models.user.findOne({ username: sails.config.permissions.adminUsername });
    })
    .then((user) => {
      //console.log(user);
      if (user) return Promise.resolve(user);
      return sails.models.user.create({
        username: 'root',
        email: 'root@buses.com',
        password: 'toor',
        role: data.role.id,
        provider: 'local'
      }).fetch();
    })
    .then((user) => {
        //console.log(user);
    },
      (e) => {
        console.log('E', e);
      })
    .catch((err) => {
      console.log('Err', err);
    });

  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
