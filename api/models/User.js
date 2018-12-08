let bcrypt = require('bcryptjs');
module.exports = {

  // Extend with custom logic here by adding additional fields, methods, etc.
  attributes: {

    imageRealName: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    pageLanguage: {
      type: 'string'
    },
    verifyToken: {
      type: 'string'
    },
    accountIsVerify: {
      type: 'boolean',
      defaultsTo: false
    },
    owner: {
      type: 'string'
    },
    provider: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    uid: {
      type: 'string'
    },

    // Associations
    role: {
      model: 'role'
    },

    coopsLikes: {
      collection: 'cooperativa',
      via: 'users'
    },

    busesLikes: {
      collection: 'bus',
      via: 'users'
    },

  },

  getimageRealName: function () {
    return 'images/user/default_user.png';
  },
  customToJSON: function () {
    return _.omit(this, ['password']);
  },
  // Lifecycle Callbacks
  beforeCreate: function (user, cb) {
    // Create the verify token
    user.pageLanguage = 'en';
    user.verifyToken = sails.services.repository.user.createVerifyToken();
    user.imageRealName = 'assets/images/user/default_user.png';
    bcrypt.hash(user.password, 8, (err, hash) => {
      if (err) return cb(err);
      user.password = hash;
      return cb();
    });
  },
  beforeUpdate: function (params, cb) {
    if (!params.password) return cb();
    bcrypt.hash(params.password, 8, (err, hash) => {
      if (err) return cb(err);
      params.password = hash;
      return cb();
    });
  },
  afterCreate:
    function setOwner (user, next) {
      sails.log.verbose('User.afterCreate.setOwner', user);
      sails.models.user
        .findOne(user.id)
        .then((_user) => {
          user = _user;
          return sails.models.role.findOne({ name: 'cliente' });
        })
        .then((role) => {
          // console.log(role);
          // promises.push(User.addToCollection(user.id, 'roles').members(role.id));
          if(user.role === null)
            return sails.models.user.update({id: user.id}).set({role: role.id});
        })
        .then(() => {
          sails.log.silly('role "cliente" attached to user', user.username);
          return next();
        })
        .catch((e) => {
          sails.log.error(e);
          next(e);
        });
    }
};
