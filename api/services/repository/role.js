import _ from 'lodash';
import async from 'async';

// toDo: guille, 2/28/18 replace async for promises

/** @namespace sails */
/** @namespace sails.models.token.findOrCreate */
// noinspection JSUnusedGlobalSymbols
/** @namespace async.each */
module.exports = {
  userRoles: (user) => {
    return sails.models.user.findOne({id: user.id}).populate('roles')
      .then((user) => {
        return Promise.resolve(user.roles);
      })
  }
};
