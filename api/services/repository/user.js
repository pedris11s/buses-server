/** @namespace sails */
var bcrypt = require('bcryptjs');
module.exports = {
  getUserByEmail: (email) => {
    return sails.models.user.findOne({email});
  },
  checkUserData: (username, email) => {
    return sails.models.user.find({or: [{username}, {email}]});
  },
  updateUser: ({id, username, email, imageRealName, name, lastName, pageLanguage, country}) => {
    if (!id) {
      return Promise.reject(new Error('undefined id'));
    }
    let query = {username, email, imageRealName, name, lastName, pageLanguage, country};
    query = sails.services.utils.removeUndefinedKeys(query);
    return sails.models.user.update(id, query).fetch()
      .then((users) => {
        if (users.length === 1) {
          return Promise.resolve(users[0]);
        }
        return Promise.reject(new Error('no user updated'));
      })
      .catch(err => {
        console.log('Err', err);
      });;
  },
  getUserById: (id) => {
    return sails.models.user.findOne({id});
  },
  getUserByUsername: (username, next) => {
    if (next) {
      sails.models.user.findOne({username}).exec((err, user) => {
        if (err) {
          sails.log.error('user.js', err);
          return next(err);
        }
        next(null, user);
      });
    }
    else {
      return sails.models.user.findOne({username});
    }
  },
  checkUserCredentials: (username, email, next) => {
    if (!sails.services.utils.validateUsername(username)) {
      // toDo: guille, 5/5/18 translate
      return next(new Error('Invalid username'));
    }
    if (!sails.services.utils.validateEmail(email)) {
      // toDo: guille, 5/5/18 translate
      return next(new Error('Invalid email'));
    }
    sails.models.user.find({
      or: [
        {username: username},
        {email: email}
      ]
    }).exec((err, users) => {
      if (err) {
        return next(err);
      }
      next(err, users);
    });
  },
  isRoleAdmin: (user) => {
    for (let roles of user.roles) {
      if (roles.name === 'admin') return true;
    }
    return false;
  },

  cleanUser: (user) => {
    return _.pick(user, [
      'id',
      'username',
      'email',
      'autologinToken',
      'roles',
      'imageRealName',
      'pageLanguage']);
  },

  updateProfilePassword: (req, next) => {
    module.exports.validatePassword(req.body.currentPassword, req.user.id)
      .then((isValid) => {
        if(!isValid) next(null, false);
        User.update(req.user.id, {password: req.body.newPassword})
          .then(() => next(null, true));
      });
  },

  validatePassword: (password, userId) => {
    return new Promise(next => {
      User.findOne(userId)
        .then((user) => {
          bcrypt.compare(password, user.password, (err, res) => {
            next(res);
          })
        })
    });
  },

  createUser: ({username, email, imageRealName = '', accountIsVerify = false, password, provider = 'local', uid = '', name ='', lastName = ''}) => {
    return sails.models.user.create({username, email, imageRealName, accountIsVerify, password, provider, uid, name, lastName})
      .fetch();
  },
  createVerifyToken: (size) => {
  if (!size || size < 0) {
    size = 40;
  }
  const dictionary = 'abcdefghijkrmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  let value = '';
  for (let i = 0; i < size; i++) {
    value += dictionary[Math.floor(Math.random() * 10000) % _.size(dictionary)];
  }
  return value;
}
};
